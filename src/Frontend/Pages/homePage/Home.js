import React, { useContext, useRef } from "react";
import styles from "./home.module.css";
import { Logo } from "../images/Logo.js";
import { useNavigate } from "react-router-dom";
import LoginContext from "../../context/context.js";
import Article from "../articles/Article.js";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const navigate = useNavigate();
  const { logout, loggedIn } = useContext(LoginContext);

  const about = useRef(null);
  const articles = useRef(null);

  
  const logoutUser = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Get the token from local storage
      const headers = {
        token: `Bearer ${token}`,
      };
      
  
      const { data } = await axios.get(
        "https://backend-server-chi-nine.vercel.app/logout",
        {
          headers,
          withCredentials: true,
        }
      );
      console.log(data);
      if (data?.msg === "loggedout") {
        logout();
      }
    } catch (error) {
      console.log("Error in logout", error);
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div >
      <div className={styles.homepageContainer}>
        <header>
          <div className={styles.logoContainer}>
            <Logo />
            <div >
              <h4 className={styles.text}>MindMaple</h4>
              <h6 className={`${styles.text} text-xs`}>
                A mental health chat assistance
              </h6>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            {loggedIn && (
              <button
                onClick={() => {
                  navigate("/analysis");
                }}
              >
                <i className="fas fa-chart-bar" style={{ fontSize: '20px', paddingRight: '10px' }}></i>

                Analyse
              </button>
            )}
            <button
              onClick={() => {
                if (!loggedIn) navigate("/login");
                else {
                  logoutUser();
                }
              }}
            >
              <span className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={loggedIn ? faSignOutAlt : faArrowLeft}
                  style={{ fontSize: '20px', paddingRight: '10px' }}
                />
                {loggedIn ? 'Logout' : 'Login'}

              </span>
            </button>
          </div>
        </header>
        <main style={{ minHeight: "100vh" }}>
          <section className={styles.leftSection}>
            <h1>
              Mental Health <br /> Solved with{" "}
              <span className={styles.ai}>AI</span>
            </h1>
            <div
              className={styles.chatWithUs}
              onClick={() => {
                navigate("/message");
              }}
            >
              Chat with us...<span className={styles.cursor}></span>
            </div>
          </section>
        </main>
        <section
          ref={about}
          className={`flex flex-col items-center gap-2 mb-4 ${styles.aboutUs}`}
        >
          <h1 className={`text-4xl font-bold mb-4 ${styles.lato}`}>About Us</h1>
          <div className={`text-center text-lg ${styles.lato}`}>
            Welcome to our mental health chat platform. We're a supportive
            community with an empathetic AI here to listen, encourage, and
            provide valuable resources. Your well-being is our priority, and
            we're dedicated to fostering open dialogue about mental health.
            You're not alone; we're here to support you on your journey. Let's
            create a space where understanding and support thrive together.
          </div>
        </section>
        <section className={`mt-8 ${styles.statsBox}`}>
          <h1 className="text-center text-4xl font-bold mb-8">
            Mental health Issues are Common
          </h1>
          <div className={styles.statsSection}>
            <img
              src={
                "https://media.istockphoto.com/id/184938488/photo/multicolored-pie-chart.jpg?s=612x612&w=0&k=20&c=1oG8aqJ3bUNc-dHwkQFOMs9DR_qWtztstcxpiiUqLrs="
              }
              alt=""
            />
            <div className="text-center flex flex-col justify-center gap-4">
              <h2 className="text-2xl">Do You know?</h2>
              <p className="text-lg text-justify">
                Mental health awareness is crucial in today’s society. As we continue to navigate the complexities of modern life, the prevalence of mental health issues has become increasingly apparent. According to the World Health Organization, depression is the leading cause of disability worldwide, affecting more than 264 million people of all ages. Anxiety disorders, which often coexist with depression, affect a similar number of individuals globally.One of the most significant barriers to addressing mental health issues is the stigma associated with them. Many people are reluctant to seek help due to fear of judgment or misunderstanding from others. This stigma can prevent individuals from accessing the care they need, exacerbating their condition and leading to a decrease in their quality of life. It is essential to break down these barriers and foster an environment where mental health is treated with the same importance as physical health.
              </p>
            </div>
          </div>
        </section>
        <section className="mt-8" ref={articles}>
          <h1
            className="text-center text-4xl font-bold mb-8"
            style={{ marginLeft: "150px", padding: "10px" }}
          >
            Wellness Spotlight
          </h1>
          <div className="xl:m-auto">
            <div className={styles.Article}>
              <Article
                title="Workplace Well-being"
                description="We've collected the best, tips, stats, and inspiring quotes on how to grow professionally while managing your mental health."
                Image={
                  "https://www.lyrahealth.com/wp-content/uploads/2023/08/Lyra-Workplace-Wellness-Pillar-Illustration.png"
                }
                link={"https://www.hhs.gov/surgeongeneral/priorities/workplace-well-being/index.html"}
              />
              <Article
                title="Overcoming Negative Thinking"
                description="Why your inner world has a natural tendency to go haywire and what to do about it."
                Image={
                  "https://www.successconsciousness.com/blog/wp-content/uploads/overcome-negative-thinking.jpg"
                }
                link={"https://www.thehappinessclinic.org/single-post/how-to-deal-with-negative-thoughts"}
              />
              <Article
                title="Understanding Imposter Syndrome"
                description={`For starters, it is a real thing. And, if you've ever said or thought the words, "I'm fooling everyone. I feel like a fraud," you already have some experience with it.`}
                Image={
                  "https://images.squarespace-cdn.com/content/v1/5e9bd172ae3b9707c719b4a5/89dbcd42-d425-4f21-ad10-e105e504f47f/Picture3.png"
                }
                link={"https://www.mcleanhospital.org/essential/impostor-syndrome#:~:text=When%20someone%20has%20impostor%20syndrome,and%20other%20high%2Dpressure%20settings."}
              />
              <Article
                title="Understanding Negativity Bias"
                description="What is the negativity bias? How can you overcome it?"
                Image={
                  "https://crpa-acrp-bulletin.ca/wp-content/uploads/2021/06/dinosaur.png"
                }
                link={"https://thedecisionlab.com/biases/negativity-bias"
                }
              />
            </div>
          </div>
        </section>
      </div>
      <footer className={styles.footer}>
        <div>
          <a
            href="https://github.com/Divipatidar"
            target="_blank"
            rel="noreferrer" 
            style={{ textDecoration: 'none', color: 'black' }}
          >
            <i className="fab fa-github" style={{ fontSize: '20px', color: 'black', padding: '10px' }}></i>

            Github
          </a>
          <a
            href="https://www.linkedin.com/in/divya-patidar-480578202"
            target="_blank"
            rel="noreferrer" 
            style={{ textDecoration: 'none', color: 'black' }}
          >
            <i className="fab fa-linkedin" style={{ fontSize: '20px', color: 'black', padding: '10px' }}></i>

            Linkedin
          </a>
          <div
            style={{
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#1e1c1b',
              color: 'white',
              fontSize: '14px',
              borderRadius: '20px'
            }}
          >
            &copy; 2024 Divya Patidar. All rights reserved.
          </div>
        </div>
      </footer>
      <button className={styles.scrollButton} onClick={scrollToTop}>
      <i className="fas fa-chevron-up" style={{ fontSize: '24px', color: '#fff' }}></i>
      </button>
    </div>
  );
}

export default Home;
