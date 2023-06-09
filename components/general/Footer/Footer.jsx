import React, { memo } from "react";
import TmdbLogo from "@/public/tmdb-logo.svg";
import Credits from "../Credits/Credits";
export function Footer() {
	return (
		<>
			<footer>
				<div className="container footer-wrapper">
					<div className="tmdb-logo">
						<a href="https://www.themoviedb.org/" target="__blank">
							<TmdbLogo />
						</a>
					</div>
					<Credits />
				</div>
			</footer>

			<style jsx>{`
				footer {
					margin-top: auto;
				}

				.footer-wrapper {
					display: flex;
					justify-content: center;
					align-items: center;
					padding-block: 1rem;
					gap: 2rem;
				}

				.tmdb-logo {
					width: 50px;
				}
			`}</style>
		</>
	);
}

export default memo(Footer);
