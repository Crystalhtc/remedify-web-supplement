'use client'

import styles from './Dashboard.module.css'
import Header from '../components/Header/Header';
import { useState, useEffect } from 'react';

export default function MedicationDetails() {
    const din = "02368099";
    const activeIngredient = "IBUPROFEN";
    const companyName = "VITA HEALTH PRODUCTS INC";
    const brandName = "IBUPROFEN EXTRA STRENGTH CAPLETS";
    const dosageForm = "Tablet"

    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [uses, setUses] = useState('');
    const [sideEffects, setSideEffects] = useState([]);

    const getMedication = async () => {
        setIsLoading(true);
        const response = await fetch("/api", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                din,
                companyName,
                brandName,
                activeIngredient,
                dosageForm,
            })
        });
        const data = await response.json();
        setDescription(data.description);
        setSideEffects(data.sideEffects);
        setUses(data.uses);
        setIsLoading(false);
        console.log(data);
    }

    useEffect(() => {
        getMedication();
    }, []);

    return (
        <div>
            <Header />
            <main className={styles.main}>
                <div className={styles.links}>
                    <a href='/'>Search</a>
                    <p>/</p>
                    <p className={styles.currentPage}>{brandName}</p>
                </div>
                <div className={styles.medName}>
                    <h2>{brandName}</h2>
                    <p>Drug identification number: {din}</p>
                    <p>Company Name: {companyName}</p>
                </div>
                <div className={styles.outerBentoContainer}>
                    <section>
                        <h3>Drug Info</h3>
                        <p>{isLoading ? "Loading..." : description}</p>
                    </section>

                    <section>
                        <h3>Uses</h3>
                        <p>{isLoading ? "Loading..." : uses}</p>
                    </section>

                    <section>
                        <h3>Drug Contraindication</h3>
                        <ul>
                            {/* <li>Dosage Form</li>
                            <li>Packaging</li>
                            <li>Intake Form:</li>
                            <li>Product Status</li> */}
                        </ul>
                    </section>

                    <section className={styles.ingredients}>
                        <h3>Ingredients</h3>
                        <ul>
                        </ul>
                    </section>

                    <section className={styles.sideEffects}>
                        <h3>Side Effects</h3>
                        <ul>
                            {isLoading ? <p>Loading...</p>
                            :sideEffects.map((effect, index) => (
                                <li key={index}>{effect}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h3>Allergies</h3>
                        <ul>
                            {/* <li>Dosage Form</li>
                            <li>Packaging</li>
                            <li>Intake Form:</li>
                            <li>Product Status</li> */}
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
}