import Navbar from '@/components/organisms/navbar';
import { Typography } from '@mui/material';
import styles from './page.module.css';

const Home = async () => {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Typography variant="h1">ONIRIA</Typography>
        <Navbar />
      </main>
    </div>
  );
};

export default Home;
