import styles from "./Slider.module.css";
import Image from "next/image";
import classNames from "classnames";

export default function Slider({ popularMovies, style }) {
	return (
		<section className={styles.section} style={style}>
			<div className={styles.wrapper}>
				<div className={classNames(styles.slider)}>
					{popularMovies.results.map((el) => {
						return (
							<Image
								width="154"
								height="231"
								src={`https://image.tmdb.org/t/p/w154${el.poster_path}`}
								alt={el.title}
								key={el.id}
							/>
						);
					})}
					{popularMovies.results.map((el) => {
						return (
							<Image
								width="154"
								height="231"
								src={`https://image.tmdb.org/t/p/w154${el.poster_path}`}
								alt={el.title}
								key={`${el.id + 1}`}
							/>
						);
					})}
				</div>
			</div>
		</section>
	);
}
