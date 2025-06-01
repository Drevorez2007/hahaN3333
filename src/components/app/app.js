import React, { Component } from "react";
import MovieList from "../movie-list/movie-list";
import "./app.css";
import MovieService from "../movie-service/movie-service";
import Search from "../movie-search/movie-search";
import debounce from "lodash.debounce";
import Spinner from "../spinner/spinner";
import PaginationPage from "../pagination/pagination";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      fieldNameMovie: "",
      arrayFilm: [],
      loading: false,

      searchCurrentPage: 1,
      searchTotalPage: null,
      totalResults: null,

      guestSessionId: null,
      activeTab: "search",

      ratedMovies: [],
      ratedMap: {},
      ratedCurrentPage: 1,
      ratedTotalResults: 0,

      genres: [],
    };

    this.debouncedSearch = debounce(this.fetchMovies, 1000);
  }

  movieService = new MovieService();

  componentDidMount() {
    const init = async () => {
      const genresResponse = await this.movieService.getGenres();
      this.setState({ genres: genresResponse.genres });

      const savedSession = localStorage.getItem("guestSessionId");
      const savedExpiresAt = localStorage.getItem("expiresAt");
      const now = new Date();

      if (savedSession && savedExpiresAt && new Date(savedExpiresAt) > now) {
        this.setState(
          {
            guestSessionId: savedSession,
            expiresAt: savedExpiresAt,
          },
          () => {
            console.log(
              "⚙️ fetchMovies / fetchRatedMovies — guestSessionId:",
              this.state.guestSessionId
            );
            this.fetchMovies();
            this.fetchRatedMovies();
          }
        );
      } else {
        const session = await this.movieService.getInformationSession();
        localStorage.setItem("guestSessionId", session.guest_session_id);
        localStorage.setItem("expiresAt", session.expires_at);

        this.setState(
          {
            guestSessionId: session.guest_session_id,
            expiresAt: session.expires_at,
          },
          () => {
            console.log(
              "⚙️ fetchMovies / fetchRatedMovies — guestSessionId:",
              this.state.guestSessionId
            );
            this.fetchMovies();
            this.fetchRatedMovies();
          }
        );
      }
    };

    init();
  }

  normalizeRatedMap = (movies) =>
    movies.reduce((acc, { id, rating }) => {
      acc[id] = rating;
      return acc;
    }, {});

  fetchRatedMovies = async (page = 1) => {
    const { guestSessionId } = this.state;
    if (!guestSessionId) return;

    this.setState({ loading: true });

    try {
      const data = await this.movieService.getRatedMovies(guestSessionId, page);

      const results = data?.results || [];
      const ratedMap = this.normalizeRatedMap(results);

      const totalPagesFromAPI = Number(data.total_pages);
      const totalResults = Number(data.total_results);
      const totalPagesCalculated =
        !isNaN(totalPagesFromAPI) && totalPagesFromAPI > 0
          ? totalPagesFromAPI
          : Math.ceil(totalResults / 20);
      const ratedTotalPage = Math.max(1, totalPagesCalculated);

      this.setState({
        ratedMovies: results,
        ratedMap,
        ratedCurrentPage: page,
        ratedTotalResults: totalResults,
        ratedTotalPage,
        loading: false,
      });
    } catch (err) {
      if (err && (err.status === 404 || err.message?.includes("404"))) {
        console.warn(
          "Session may be invalid. Trying to create a new session..."
        );

        try {
          const session = await this.movieService.getInformationSession();
          const newGuestSessionId = session.guest_session_id;
          const expiresAt = session.expires_at;

          localStorage.setItem("guestSessionId", newGuestSessionId);
          localStorage.setItem("expiresAt", expiresAt);

          this.setState(
            {
              guestSessionId: newGuestSessionId,
              expiresAt,
            },
            () => {
              this.fetchRatedMovies(page);
            }
          );
        } catch (sessionErr) {
          console.error("Failed to create new session:", sessionErr);
          this.setState({ loading: false });
        }
      } else {
        console.error("Failed to fetch rated movies:", err);
        this.setState({ loading: false });
      }
    }
  };

  onChangePageRated = (page) => {
    const { ratedTotalPage } = this.state;
    if (!ratedTotalPage || page < 1 || page > ratedTotalPage) return;
    this.fetchRatedMovies(page);
  };

  onChangePageSearch = (page) => {
    this.setState(
      {
        searchCurrentPage: page,
      },
      () => {
        this.fetchMovies(page);
      }
    );
  };

  setActiveTab = (tab) => {
    this.setState({ activeTab: tab }, () => {
      if (tab === "rated" && this.state.guestSessionId) {
        this.fetchRatedMovies(this.state.ratedCurrentPage);
      }
      if (tab === "search") {
        this.fetchMovies(this.state.searchCurrentPage);
      }
    });
  };

  onRateMovie = (movieId, value) => {
    const { guestSessionId } = this.state;

    this.movieService
      .rateMovie(movieId, value, guestSessionId)
      .then(() => {
        this.setState(
          (prevState) => ({
            ratedMap: { ...prevState.ratedMap, [movieId]: value },
          }),
          () => {
            if (this.state.activeTab === "rated") {
              this.fetchRatedMovies();
            }
          }
        );
      })
      .catch((err) => console.error("Rating failed", err));
  };

  onSearchSubmit = () => {
    const { fieldNameMovie } = this.state;
    this.movieService.getInformationMovie(fieldNameMovie).then((data) => {
      this.setState({ arrayFilm: data.results || [] });
    });
  };

  onInputChange = (value) => {
    this.setState({ fieldNameMovie: value, currentPage: 1 }, () => {
      if (value.trim() !== "") {
        this.debouncedSearch();
      }
    });
  };

  fetchMovies = (page = this.state.searchCurrentPage) => {
    this.setState({ loading: true });
    this.movieService
      .getInformationMovie(this.state.fieldNameMovie, page)
      .then((data) => {
        this.setState({
          arrayFilm: data.results,
          searchTotalPage: data.total_pages,
          searchCurrentPage: page,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({ arrayFilm: [], loading: false });
      });
  };

  render() {
    const {
      fieldNameMovie,
      arrayFilm,
      ratedMovies,
      ratedMap,
      loading,
      activeTab,
      searchCurrentPage,
      searchTotalPage,
      ratedCurrentPage,
      ratedTotalPage,
      ratedTotalResults,
      searchTotalResults,
    } = this.state;

    return (
      <div className="container-app">
        <div className="button-container">
          <div className="tabs">
            <button
              className={activeTab === "search" ? "tab active" : "tab"}
              onClick={() => this.setActiveTab("search")}
            >
              Search
            </button>
            <button
              className={activeTab === "rated" ? "tab active" : "tab"}
              onClick={() => this.setActiveTab("rated")}
            >
              Rated
            </button>
          </div>
        </div>

        {activeTab === "search" && (
          <>
            <Search value={fieldNameMovie} onInputChange={this.onInputChange} />
            {loading ? (
              <div className="loading-spinner">
                <Spinner />
              </div>
            ) : (
              <>
                <MovieList
                  arrayFilm={arrayFilm}
                  fieldNameMovie={fieldNameMovie}
                  onRateMovie={this.onRateMovie}
                  ratedMap={ratedMap}
                  genres={this.state.genres}
                />
                {arrayFilm.length > 0 && searchTotalPage > 1 && (
                  <PaginationPage
                    currentPage={searchCurrentPage}
                    totalPage={searchTotalPage}
                    onChangePage={this.onChangePageSearch}
                  />
                )}
              </>
            )}
          </>
        )}
        {activeTab === "rated" && (
          <>
            {loading ? (
              <div className="loading-spinner">
                <Spinner />
              </div>
            ) : (
              <>
                <MovieList
                  arrayFilm={ratedMovies}
                  fieldNameMovie=""
                  onRateMovie={this.onRateMovie}
                  ratedMap={ratedMap}
                  genres={this.state.genres}
                />
                {ratedMovies.length > 0 && ratedTotalPage > 1 && (
                  <PaginationPage
                    currentPage={ratedCurrentPage}
                    totalPage={ratedTotalPage}
                    onChangePage={this.onChangePageRated}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    );
  }
}
