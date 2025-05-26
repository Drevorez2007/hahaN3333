import React from "react";
import MovieCard from "../movie-card/movie-card";
import "./movie-list.css";
import Spinner from "../spinner/spinner";

const MovieList = ({ arrayFilm, onRateMovie, ratedMap, genres }) => {
  const genreMap = genres?.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {});

  return (
    <div className="movie-list">
      {arrayFilm.map((film) => (
        <MovieCard
          key={film.id}
          title={film.title}
          releaseDate={film.release_date}
          genres={genreMap ? film.genre_ids.map((id) => genreMap[id]) : []}
          description={film.overview}
          poster={film.poster_path}
          movieId={film.id}
          onRateMovie={onRateMovie}
          userRating={ratedMap?.[film.id] || 0}
          voteAverage={film.vote_average}
        />
      ))}
    </div>
  );
};

export default MovieList;
