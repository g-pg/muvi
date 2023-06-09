import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PrimaryLayout, { PageTitle } from "@/components/general/PrimaryLayout/PrimaryLayout";
import Loading from "@/components/general/Loading/Loading";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { MdStar, MdKeyboardBackspace } from "react-icons/md";
import PrimaryBtn from "@/components/general/PrimaryBtn/PrimaryBtn";
import addMovie from "@/lib/addMovie";
import SecondaryBtn from "@/components/general/SecondaryBtn/SecondaryBtn";
import { useSession } from "next-auth/react";
import { checkIfSeen } from "@/lib/checkIfSeen";
import useCurrentUser from "@/hooks/useCurrentUser";
export default function MovieDetails() {
	const router = useRouter();
	const { id } = router.query;
	const [movie, setMovie] = useState([]);
	const { status: authStatus } = useSession({
		required: true,
		onUnauthenticated() {
			router.push("/?auth=true");
		},
	});

	const { data: user } = useCurrentUser();

	useEffect(() => {
		async function getMovieInfo() {
			try {
				const res = await axios.get(`/api/searchmovie?id=${id}`);
				setMovie(res.data[0]);
			} catch (error) {
				toast.error("Não foi possível encontrar este filme.");
			}
		}
		getMovieInfo();
	}, [setMovie, id]);

	async function handleAddMovie() {
		try {
			const res = await addMovie(movie.id, "moviesToSee");
			toast.success(res.data);
		} catch (error) {
			toast.error(error.message);
		}
	}

	if (movie.length < 1) {
		return <Loading />;
	}

	return (
		<>
			<PrimaryLayout>
				<div className="container">
					<nav style={{ marginBottom: "1rem" }}>
						<SecondaryBtn
							icon={<MdKeyboardBackspace />}
							content="Voltar"
							as="btn"
							onClick={router.back}
						/>
					</nav>
					<section className="wrapper">
						<div className="poster-wrapper">
							{movie.poster_path ? (
								<Image
									src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
									// fill
									// object-fit="cover"
									alt={movie.title}
									// style={{ maxWidth: "100%" }}
									width="780"
									height="1170"
									className="poster"
									priority
								/>
							) : (
								<p style={{ marginTop: "auto" }}>Poster indisponível.</p>
							)}
						</div>
						<div className="info">
							<h3 className="movie-title">{movie.title}</h3>
							<div className="genre-wrapper">
								{movie.genres.map((el) => (
									<p key={el.id} className="genre">
										{el.name}
									</p>
								))}
								<p className="info-general" style={{ fontWeight: "700" }}>
									<MdStar color="var(--cl-accent)" />{" "}
									{movie.vote_average.toFixed(1)}
								</p>
							</div>
							<p className="info-general">Duração: {movie.runtime} minutos.</p>
							<p className="info-general">
								Lançamento: {movie.release_date.split("-")[0]}.
							</p>
							<p className="info-general">{movie.overview}</p>
							<div className="btn">
								{!checkIfSeen(user, id) ? (
									<PrimaryBtn
										style={{ marginTop: "auto" }}
										onClick={handleAddMovie}
									>
										Adicionar
									</PrimaryBtn>
								) : (
									<PrimaryBtn
										style={{
											marginTop: "auto",
											background: "var(--cl-green)",
											cursor: "unset",
										}}
									>
										Visto
									</PrimaryBtn>
								)}
							</div>
						</div>
					</section>
				</div>
			</PrimaryLayout>
			<style jsx>
				{`
					.container {
						margin: 0 auto;
					}
					.poster-wrapper :global(.poster) {
						width: 100%;
						height: auto;
						border-radius: 8px;
					}
					.poster-wrapper {
						max-width: 450px;
						flex-basis: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					.info {
						flex-basis: 100%;
					}
					.wrapper {
						display: flex;
						gap: 2rem;
						width: 80%;
						margin: 0 auto;
					}
					.info {
						display: flex;
						flex-direction: column;
						gap: 1rem;
					}
					.movie-title {
						font-size: 1.5rem;
						margin-bottom: 1rem;
					}
					.genre-wrapper {
						display: flex;
						align-items: center;
						flex-wrap: wrap;
						gap: 0.5rem;
					}
					.genre {
						display: inline-block;

						font-size: 0.9rem;
						font-weight: 700;
					}
					.info-general {
						color: var(--cl-text);
						font-size: 0.9rem;
						display: flex;
						align-items: center;
						gap: 0.3em;
					}

					.btn {
						max-width: 200px;
					}
					@media (max-width: 780px) {
						.wrapper {
							flex-direction: column;
							width: 100%;
						}
					}
				`}
			</style>
		</>
	);
}
