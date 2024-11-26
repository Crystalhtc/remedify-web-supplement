import styles from "./About.module.css";
import Header from "../components/Header/Header";

export default function About() {
    return (
        <div>
            <Header/>
`        <div className={styles.about}>
            <div className={styles.imageContainer}>
                <img src="/banner-image.png" alt="Remedify logo" className={styles.image}/>
            </div>
            <div className={styles.textContainer}>
                <div>
                    <h2>About Us</h2>
                </div>
                <div className={styles.description}>
                    <p>
                    Welcome to Project Remedify, an app designed to make remembering to take your
                    medication easier than ever before. Remedify aims to improve medication
                    adherence while maintaining a low learning curve to prioritize accessibility
                    for users. Users who are prone to polypharmacy and cognitive impairments will
                    have a convenient reminder and easy support system in their life. In addition
                    to our support system at the touch of your fingers, Remedify aims to empower
                    our users by giving them full control over their schedule and medication
                    details.
                    </p>
                    <p>
                    One method of improving medication adherence will be done with help from AI.
                    This will involve features such as recognizing instructions and medications
                    from photos via OCR/Vision, and providing users with information.
                    </p>
                    <button>
                        <a href="https://www.remedify.ca/" className={styles.button}>
                            Know More About Us
                        </a>
                    </button>
                </div>
            </div>
        </div>`
        </div>
    );
}