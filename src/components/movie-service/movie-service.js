import React, { Component } from "react";

class MovieService {
  constructor() {
    this.apiKey =
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYTcxNTIyOGQ3ODU1NjU4OWMyZTQ2ZGFmYzNhYmIyOCIsIm5iZiI6MTc0NjE5NDI4MS40NTcsInN1YiI6IjY4MTRjZjY5ZDM4ZDYyYjRjNzkxMmE1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uheaL5IILSj5fIl39xyECm_d4bYWE4JatfUVhWMSzD0";
  }

  async getInformationMovie(filmValue, page = 1) {
    const result = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${filmValue}&include_adult=false&language=en-US&page=${page}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          accept: "application/json",
        },
      },
    );

    return result.json();
  }

  async getInformationSession() {
    const result = await fetch(
      "https://api.themoviedb.org/3/authentication/guest_session/new",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          accept: "application/json",
        },
      },
    );

    return result.json();
  }

  async rateMovie(movieId, value, sessionId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${sessionId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ value }),
    });

    if (!response.ok) {
      const error = new Error(
        `Failed to rate movie. Status: ${response.status}`,
      );
      error.status = response.status;
      throw error;
    }

    return response.json();
  }

  async getRatedMovies(sessionId, page = 1) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      if (res.status === 404) {
        console.warn("⚠️ Нет оценённых фильмов для этой guest session");
        return {
          results: [],
          total_pages: 1,
          total_results: 0,
        };
      }

      if (!res.ok) {
        const error = new Error(`HTTP error! status: ${res.status}`);
        error.status = res.status;
        throw error;
      }

      return await res.json();
    } catch (err) {
      console.error(" Ошибка в getRatedMovies:", err);
      throw err;
    }
  }

  async getGenres() {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?language=en`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      },
    );
    return res.json();
  }
}

export default MovieService;
