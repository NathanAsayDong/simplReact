import { FC, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import OnboardingReview from './Review/Review';
import UserCategories from './UserCategories/UserCategories';
import UserInfo from './UserInfo/UserInfo';

import { LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import { attemptCreateAccount } from '../../services/Classes/userApiService';
import { OnboardingDataProvider } from './Onboarding.context';
import './Onboarding.scss';

interface OnboardingProps { handleLogin: () => void; }

const Onboarding: FC<OnboardingProps> = ({ handleLogin }) =>  {
    const [swiperRef, setSwiperRef] = useState<any>(null);
    const [lastSlide, setLastSlide] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const reviewRef = useRef<any>(null);
    const navigate = useNavigate();


    const navigateToLogin = () => {
        localStorage.removeItem('id');
        navigate('/login')
    }

    const save = async () => {
        reviewRef.current?.save();
    }

    const createAccount = async () => {
        if (email === '' || password === '') {
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            alert('Invalid email');
            return;
        }
        if (password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }
        if (!password.match(/[0-9]/)) {
            alert('Password must contain at least one number');
            return;
        }
        if (!password.match(/[A-Z]/)) {
            alert('Password must contain at least one capital letter');
            return;
        }
        const success = await attemptCreateAccount(email, password);
        if (success) {
            localStorage.setItem('id', success.authToken);
            handleLogin();
        }
        else {
            alert('Failed to create an account');
        }
    }

    return (
        <OnboardingDataProvider>
            <div className='page special-background'>
                {loading && <LinearProgress style={{marginBottom: '16px'}} color="inherit" />}
                <div className='onboarding-header'>
                    <h2 style={{"marginLeft":"10px"}}>SIMPL.</h2>
                    <button style={{"marginLeft":"auto","marginRight":"10px", "color":"var(--secondary-color"}} className="subtle-button" onClick={navigateToLogin}>Sign in with other account?</button>
                </div>

                <div className='swiper-container'>
                    <Swiper
                        modules={[]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        scrollbar={{ draggable: true }}
                        onSwiper={(swiper) => {
                            setSwiperRef(swiper);
                        }}
                        onSlideChange={() => {
                            if (lastSlide) {
                                setLastSlide(false)
                            }
                        }}
                        onReachEnd={() => {setLastSlide(true)}}
                    >
                    <SwiperSlide key={1}><UserCategories /></SwiperSlide>
                    <SwiperSlide key={2}><OnboardingReview ref={reviewRef} handleLogin={handleLogin} setLoading={setLoading}/></SwiperSlide>
                    </Swiper>
                </div>

                <div className='onboarding-footer'>
                    <div className='swiper-buttons'>
                        <button className='swiper-button-back swiper-button' onClick={() => swiperRef.slidePrev()}>Back</button>
                        {!lastSlide && <button className='swiper-button-next swiper-button' onClick={() => swiperRef.slideNext()}>Next</button>}
                        {lastSlide && <button className='swiper-button-save swiper-button' onClick={save}>Save</button>}
                    </div>
                </div>
            </div>
        </OnboardingDataProvider>
    );

};

export default Onboarding;

