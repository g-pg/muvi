import PrimaryLayout from "@components/general/PrimaryLayout/PrimaryLayout";
import Slider from "@components/pages/Home/Slider/Slider";
import HeroSection from "@components/pages/Home/HeroSection/HeroSection";
import Head from "next/head";
import AuthModal from "@components/general/Auth/AuthModal";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import Loading from "@/components/general/Loading/Loading";
import useShowModal from "@/hooks/useShowModal";

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
	const [showModal, setShowModal] = useShowModal();
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (router.query.auth == "true") {
			setShowModal(true);
		}
	}, [router.query.auth, setShowModal]);

	if (status === "loading") {
		return <Loading />;
	} else if (status === "authenticated") {
		router.push("/user");
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

					<Slider popularMovies={popularMovies} />
				</PrimaryLayout>
				{showModal && <AuthModal setShowModal={setShowModal} />}
			</main>

			<style jsx>{``}</style>
		</>
	);
}
