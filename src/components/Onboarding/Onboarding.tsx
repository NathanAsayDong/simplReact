import { FC, useState } from 'react';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import './Onboarding.scss';
import OnboardingReview from './Review/Review';
import UserAccounts from './UserAccounts/UserAccounts';
import UserCategories from './UserCategories/UserCategories';
import UserInfo from './UserInfo/UserInfo';



interface OnboardingProps { toggleCreateAccount: () => void; }

const Onboarding: FC<OnboardingProps> = ({ toggleCreateAccount }) =>  {
    const [swiperRef, setSwiperRef] = useState<any>(null);
    const login = () => {
        toggleCreateAccount();
    }

    return (
        <>
            <div className="header">
                <h1>Onboarding</h1>
            </div>

            <div className='swiper-container'>
                <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    spaceBetween={50}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    onSwiper={(swiper) => {
                        setSwiperRef(swiper);
                        console.log(swiper);
                    }}
                    onSlideChange={() => console.log('slide change')}
                    onReachEnd={() => {/*...*/}}
                >
                    <SwiperSlide virtualIndex={1}><UserInfo /></SwiperSlide>
                    <SwiperSlide virtualIndex={2}><UserAccounts /></SwiperSlide>
                    <SwiperSlide virtualIndex={3}><UserCategories /></SwiperSlide>
                    <SwiperSlide virtualIndex={4}><OnboardingReview /></SwiperSlide>
                </Swiper>
            </div>

            <div className='onboarding-footer'>
                <div className='swiper-buttons'>
                    <button className='swiper-button-back' onClick={() => swiperRef.slidePrev()}>Back</button>
                    <button className='swiper-button-next' onClick={() => swiperRef.slideNext()}>Next</button>
                </div>

                <button onClick={login}>Already have an account?</button>
            </div>
        </>
    );

};

export default Onboarding;

function userRef(arg0: null) {
    throw new Error('Function not implemented.');
}
