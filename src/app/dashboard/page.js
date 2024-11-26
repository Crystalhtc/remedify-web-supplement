import styles from './Dashboard.module.css'
import Header from '../components/Header/Header';

export default function MedicationDetails() {

    return (
        <div>
            <Header />
            <main className={styles.main}>
                <div className={styles.links}>
                    <a href='/'>Search</a>
                    <p>/</p>
                    <p className={styles.currentPage}>Insulin Lispro</p>
                </div>
                <div className={styles.medName}>
                    <h2>Insulin Lispro</h2>
                    <p>Drug identification number: ####</p>
                    <p>Brand Name: Lorem</p>
                    <p>Company Name: Lorem</p>
                </div>
                <div className={styles.outerBentoContainer}>
                    <section>
                        <h3>Drug Info</h3>
                        <ul>
                            <li>Dosage Form</li>
                            <li>Packaging</li>
                            <li>Intake Form:</li>
                            <li>Product Status</li>
                            <li>Dosage Form</li>
                            <li>Packaging</li>
                            <li>Intake Form:</li>
                            <li>Product Status</li>
                        </ul>
                    </section>

                    <section>
                        <h3>Uses</h3>
                        <ul>
                            <li>Dosage Form</li>
                            <li>Packaging</li>
                            <li>Intake Form:</li>
                            <li>Product Status</li>
                        </ul>
                    </section>

                    <section>
                        <h3>Drug Contraindication</h3>
                        <ul>
                            <li>Dosage Form</li>
                            <li>Packaging</li>
                            <li>Intake Form:</li>
                            <li>Product Status</li>
                        </ul>
                    </section>

                    <section className={styles.ingredients}>
                        <h3>Ingredients</h3>
                        <ul>
                            <li>Dosage Form</li>
                            <li>Packaging</li>
                            <li>Intake Form:</li>
                            <li>Product Status</li>
                        </ul>
                    </section>

                    <section className={styles.sideEffects}>
                        <h3>Side Effects</h3>
                        <ul>
                            <li>Dosage Form</li>
                            <li>Packaging</li>
                            <li>Intake Form:</li>
                            <li>Product Status</li>
                        </ul>
                    </section>

                    <section>
                        <h3>Allergies</h3>
                        <ul>
                            <li>Dosage Form</li>
                            <li>Packaging</li>
                            <li>Intake Form:</li>
                            <li>Product Status</li>
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
}