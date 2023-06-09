import styles from "./HeroSection.module.css";
import PrimaryBtn from "@/components/general/PrimaryBtn/PrimaryBtn";

import classNames from "classnames";

export default function HeroSection({ setShowAuthModal }) {
	return (
		<section className={classNames(styles.section)}>
			<div className={classNames(styles.wrapper, "container")}>
				<div className={classNames(styles.column)}>
					<h2>O que é bom a gente guarda.</h2>
					<p>
						Por que perder aquela recomendação se você pode anotar tudo{" "}
						<b>aqui</b>? Registre os filmes que você quer ver e nunca mais perca
						tempo procurando o que assistir.
					</p>
					<div className={styles.btn}>
						<PrimaryBtn
							onClick={() => setShowAuthModal(true)}
							style={{ maxWidth: "200px", position: "relative" }}
						>
							Começar agora
						</PrimaryBtn>
					</div>
				</div>
			</div>
		</section>
	);
}
