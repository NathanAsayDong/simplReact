import { FC, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import OnboardingReview from './Review/Review';
import UserCategories from './UserCategories/UserCategories.component';
import { LinearProgress } from '@mui/material';
import 'swiper/css';
import { OnboardingDataProvider } from './Onboarding.context';
import './Onboarding.scss';
import UserAccounts from './UserAccounts/UserAccounts';

interface OnboardingProps { handleLogin: (firebaseAuthId: string) => void; }

const Onboarding: FC<OnboardingProps> = ({ handleLogin }) =>  {
    const [swiperRef, setSwiperRef] = useState<any>(null);
    const [lastSlide, setLastSlide] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const reviewRef = useRef<any>(null);

    const handleSave = async () => {
        setLoading(true);
        await reviewRef.current.save();
        setLoading(false);
    };

    const returnToLogin = () => {
        localStorage.removeItem('firebaseAuthId');
        handleLogin('');
        window.location.reload();
    }

    return (
        <OnboardingDataProvider>
            <div className={'onboarding special-background'}>
                {loading && <LinearProgress style={{marginBottom: '16px'}} color="inherit" />}
                <div className='onboarding-header'>
                    <h2 style={{"marginLeft":"10px"}}>SIMPL.</h2>
                    <p className='has-account-button' onClick={returnToLogin}>Sign in with other account?</p>
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
                        <SwiperSlide key={2}><UserAccounts /></SwiperSlide>
                        <SwiperSlide key={3}><OnboardingReview ref={reviewRef} handleLogin={handleLogin} setLoading={setLoading} /></SwiperSlide>
                    </Swiper>
                </div>

                <div className='onboarding-footer'>
                    <div className='swiper-buttons'>
                        <button className='swiper-button-back swiper-button' onClick={() => swiperRef.slidePrev()}>Back</button>
                        {!lastSlide && <button className='swiper-button-next swiper-button' onClick={() => swiperRef.slideNext()}>Next</button>}
                        {lastSlide && <button className='special-background-animated swiper-button-save' onClick={handleSave}>Save</button>}
                    </div>
                </div>
                
            </div>
        </OnboardingDataProvider>
    );

};

export default Onboarding;

