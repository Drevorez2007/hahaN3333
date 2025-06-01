import "./movie-card.css";
import React from "react";
import RateStar from "../rate/rate";
import "../rate/rate.css";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import clsx from "clsx";

const MovieCard = ({
  title,
  releaseDate,
  genres,
  description,
  poster,
  movieId,
  userRating = 0,
  onRateMovie,
  voteAverage,
}) => {
  const handleRate = (value) => {
    onRateMovie(movieId, value);
  };

  const formattedDate = releaseDate
    ? format(new Date(releaseDate), "dd MMMM yyyy", { locale: ru })
    : "";

  const getRatingColorClass = () => {
    switch (true) {
      case voteAverage < 3:
        return "movie_rating--red";
      case voteAverage <= 5:
        return "movie_rating--orange";
      case voteAverage <= 7:
        return "movie_rating--yellow";
      default:
        return "movie_rating--green";
    }
  };

  return (
    <div className="cards-wrapper">
      <div className="movie-card">
        <img
          src={`https://image.tmdb.org/t/p/w500${poster}`}
          alt={title}
          className="movie-poster"
        />
        <div className="main-information">
          <div className="movie-details-container">
            <div className="title-rating-row">
              <h2 className="movie-title">{title}</h2>
              <div className={clsx("movie_rating", getRatingColorClass())}>
                {voteAverage.toFixed(1)}
              </div>
            </div>
            <p className="movie-date">{formattedDate}</p>
            <div className="movie-genres">
              {(genres || []).map((genre, i) => (
                <span key={i} className="genre">
                  {genre}
                </span>
              ))}
            </div>
            <p className="movie-description">{description}</p>
          </div>
          <div className="rate-stars">
            <RateStar onRate={handleRate} currentRating={userRating} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
