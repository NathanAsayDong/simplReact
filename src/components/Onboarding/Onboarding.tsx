import { FC, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import OnboardingReview from './Review/Review';
import UserAccounts from './UserAccounts/UserAccounts';
import UserCategories from './UserCategories/UserCategories';
import UserInfo from './UserInfo/UserInfo';

import 'swiper/css';
import { OnboardingDataProvider } from './Onboarding.context';
import './Onboarding.scss';

interface OnboardingProps { toggleCreateAccount: () => void; }

const Onboarding: FC<OnboardingProps> = ({ toggleCreateAccount }) =>  {
    const [swiperRef, setSwiperRef] = useState<any>(null);
    const login = () => {
        toggleCreateAccount();
    }

    return (
        <OnboardingDataProvider>
            <>
            <div className='onboarding-header'>
                <h2 style={{"marginLeft":"10px"}}>SIMPL.</h2>
                <button style={{"marginLeft":"auto","marginRight":"10px"}} className="subtle-button" onClick={login}>Already have an account?</button>
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
                            console.log(swiper);
                        }}
                        onSlideChange={() => console.log('slide change')}
                        onReachEnd={() => {console.log('end')}}
                    >
                    <SwiperSlide key={1}><UserInfo /></SwiperSlide>
                    <SwiperSlide key={2}><UserAccounts /></SwiperSlide>
                    <SwiperSlide key={3}><UserCategories /></SwiperSlide>
                    <SwiperSlide key={4}><OnboardingReview /></SwiperSlide>
                    </Swiper>
                </div>

                <div className='onboarding-footer'>
                    <div className='swiper-buttons'>
                        <button className='swiper-button-back swiper-button' onClick={() => swiperRef.slidePrev()}>Back</button>
                        <button className='swiper-button-next swiper-button' onClick={() => swiperRef.slideNext()}>Next</button>
                    </div>
                </div>
            </>
        </OnboardingDataProvider>
    );

};

export default Onboarding;

