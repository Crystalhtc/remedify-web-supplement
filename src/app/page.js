import styles from "./page.module.css";
import Header from "./components/Header/Header";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section id='header'></section>
        <Header />
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Drug identification number</th>
              <th>Dosage Form</th>
              <th>Brand Name</th>
              <th>Company Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Insulin Lispro</td>
              <td>####</td>
              <td>Insulin Lispro</td>
              <td>Insulin Lispro</td>
              <td>Insulin Lispro</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
}
