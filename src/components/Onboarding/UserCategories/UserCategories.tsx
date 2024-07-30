import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { OnboardingData } from '../Onboarding.context';
import './UserCategories.scss';



interface UserCategoriesProps {}

const UserCategories: FC<UserCategoriesProps> = () =>  {
    const OnboardingContext = OnboardingData();

    const addCategory = () => {
        console.log('Add Category');
        const categories = OnboardingContext.onboardingData?.categories;
        const newCategory = document.getElementById('newCategory') as HTMLInputElement;
        if (categories) {
            OnboardingContext.setCategories([...categories, newCategory.value]);
        }
        else {
            OnboardingContext.setCategories([newCategory.value]);
        }
    }
    
    return (
        <>
            <h1 className='section-title'>Categories</h1>
            <div className='form-container' style={{height: 424}}>
                <div className='row'>
                    <input type='text' id='newCategory' placeholder='Category Name' />
                    <FontAwesomeIcon icon={faSquarePlus} className='add-category-icon' onClick={addCategory}/>
                </div>

                <div className='categories'>
                    {OnboardingContext.onboardingData?.categories?.map((category: string, idx: any) => (
                        <p id={idx} style={{"color":"black"}}>{category}</p>
                    ))}
                </div>

            </div>
        </>
    )
}

export default UserCategories;