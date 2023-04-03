import PrimaryLayout from "@components/general/PrimaryLayout/PrimaryLayout";
import Slider from "@components/pages/Home/Slider/Slider";
import HeroSection from "@components/pages/Home/HeroSection/HeroSection";
import Head from "next/head";
import AuthModal from "@components/general/Auth/AuthModal";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import Loading from "@/components/general/Loading/Loading";

export async function getStaticProps() {
	const KEY = process.env.MOVIEDB_KEY;
	const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&language=en-US&page=1`;

	const res = await fetch(URL);
	const popularMovies = await res.json();

	return {
		props: {
			popularMovies,
		},
	};
}

export default function Home({ popularMovies }) {
	const [showModal, setShowModal] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(true);
	const router = useRouter();

	useEffect(() => {
		async function handleAuthenticated() {
			const session = await getSession();
			if (session) {
				router.push("/user");
			} else {
				setIsAuthenticated(false);
				console.log("não há sessão");
			}
		}

		handleAuthenticated();
	}, []);

	useEffect(() => {
		console.log(router.query.auth);
		if (router.query.auth == "true") {
			setShowModal(true);
		}
	}, [router.query.auth]);

	if (isAuthenticated) {
		return <Loading />;
	}

	return (
		<>
			<Head>
				<title>Muvi</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<PrimaryLayout>
					<HeroSection setShowModal={setShowModal} />
					{/* <Slider popularMovies={popularMovies} style={{ marginTop: "8rem" }} /> */}
				</PrimaryLayout>
				{showModal && <AuthModal setShowModal={setShowModal} />}
			</main>
		</>
	);
}