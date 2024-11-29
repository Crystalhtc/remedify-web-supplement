'use client'

import styles from './Dashboard.module.css'
import Header from '../components/Header/Header';
import { useState, useEffect, act } from 'react';
import { useSearchParams } from 'next/navigation'

export default function MedicationDetails() {
    //getting info from API based on din
    const searchParams = useSearchParams();
    let din = searchParams.get('din');
    const [brandName, setBrandName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [dosageForm, setDosageForm] = useState('');
    const [activeIngredient, setActiveIngredient] = useState('');

    // set prompts for open ai
    const [description, setDescription] = useState('');
    const [uses, setUses] = useState([]);
    const [sideEffects, setSideEffects] = useState([]);
    const [drugInteraction, setDrugInteraction] = useState('');
    const [allergies, setAllergies] = useState([]);
    
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async() => {
        setIsLoading(true);
        const [drugResponse, formResponse, ingredientResponse] = await Promise.all([
            fetch('https://health-products.canada.ca/api/drug/drugproduct/?lang=en&type=json'),
            fetch('https://health-products.canada.ca/api/drug/form/?lang=en&type=json'),
            fetch('https://health-products.canada.ca/api/drug/activeingredient/?lang=en&type=json')
        ]);
        const wholeDrugData = await drugResponse.json();
        const wholeFormData = await formResponse.json();
        const wholeIngredientData = await ingredientResponse.json();

        const selectedDrugData = wholeDrugData.find((drug) => drug.drug_identification_number === din);
        const selectedFormData = wholeFormData.find((formData) => selectedDrugData.drug_code === formData.drug_code);
        const selectedIngredientData = wholeIngredientData.find((ingredientData) => selectedDrugData.drug_code === ingredientData.drug_code);

        const fetchedData = {
            brandName: selectedDrugData.brand_name,
            companyName: selectedDrugData.company_name,
            dosageForm: selectedFormData.pharmaceutical_form_name,
            activeIngredient: selectedIngredientData.ingredient_name
        };
        
        setBrandName(selectedDrugData.brand_name);
        setCompanyName(selectedDrugData.company_name);
        setDosageForm(selectedFormData.pharmaceutical_form_name);
        const formattedIngredient = selectedIngredientData.ingredient_name.charAt(0).toUpperCase() + selectedIngredientData.ingredient_name.slice(1).toLowerCase();
        setActiveIngredient(formattedIngredient);

        return fetchedData;
    }

    const getMedication = async () => {
        const { brandName, companyName, dosageForm, activeIngredient } = await fetchData();
        const response = await fetch("/api", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                din,
                brandName,
                companyName,
                dosageForm,
                activeIngredient,
            })
        });
        const data = await response.json();
        setDescription(data.description);
        setSideEffects(data.sideEffects);
        setUses(data.uses);
        setDrugInteraction(data.drugInteraction);
        setAllergies(data.allergies);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchData().then(() => {
            getMedication();
        })
    }, []);

    return (
        <div>
            <Header />
            <main className={styles.main}>
                {isLoading && <div className={styles.loading}><div><h3>Loading...</h3></div></div>}
                <div className={styles.links}>
                    <a href='/' className={styles.search}>Search</a>
                    <p>/</p>
                    <p className={styles.currentPage}>{brandName}</p>
                </div>
                <div className={styles.medName}>
                    <p>*This app is not a substitute for professional medical advice; always consult your healthcare provider for guidance.</p>
                    <h2>{brandName}</h2>
                    <p>Drug identification number: {din}</p>
                    <p>Company Name: {companyName}</p>
                </div>
                <div className={styles.outerBentoContainer}>
                    <section className={styles.overview}>
                        <h3>Overview</h3>
                        <p>{isLoading ? "" : description}</p>
                        <div>
                            <h5>Active Ingredient</h5>
                            <p>{isLoading ? "" : activeIngredient}</p>
                        </div>
                        <div>
                            <h5>Dosage Form</h5>
                            <p>{isLoading ? "" : dosageForm}</p>
                        </div>
                    </section>

                    <section>
                        <h3>Uses</h3>
                        <ul>
                            {isLoading ? <p></p>
                            :uses.map((use, index) => (
                                <li key={index}>{use}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h3>Drug Interaction</h3>
                        <p>{isLoading ? "" : drugInteraction}</p>
                    </section>

                    <section>
                        <h3>Side Effects</h3>
                        <ul>
                            {isLoading ? <p></p>
                            :sideEffects.map((effect, index) => (
                                <li key={index}>{effect}</li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h3>Allergies</h3>
                        <ul>
                            {isLoading ? <p></p>
                            :allergies.map((allergy, index) => (
                                <li key={index}>{allergy}</li>
                            ))}
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
}