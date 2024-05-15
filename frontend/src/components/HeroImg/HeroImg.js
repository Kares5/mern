import styles from './hero.module.css'

const HeroImg = () => {
  return (
    <div className={styles.container}>
        <img  src='/burger.jpg' alt='burger'/>
        <div className={styles.layer}>
          <h1> Are You Hangry So </h1>
          <p> Let's Get Started .</p>
        </div>
    </div>
  )
}

export default HeroImg
