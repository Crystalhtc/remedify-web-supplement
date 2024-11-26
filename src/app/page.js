import styles from "./page.module.css";
import Header from "./components/Header/Header";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.nav}>
        <Header />
      </div>
      
      <main className={styles.main}>

        <div className={styles.searchContainer}>
          <p className={styles.searchText}>Search:</p>
          <form className={styles.search}>
            <input className={styles.searchBar} type="text" placeholder="Type your medication name" name="search"/>
            {/* <button type="submit" className={styles.searchButton}>Search</button> */}
          </form>
        </div>
        <div className={styles.tableContainer}>
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
        </div>
        
      </main>
    </div>
  );
}
