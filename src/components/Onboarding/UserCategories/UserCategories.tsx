import { faMinusCircle, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, Key } from 'react';
import { OnboardingData } from '../Onboarding.context';
import './UserCategories.scss';


interface UserCategoriesProps {}

const UserCategories: FC<UserCategoriesProps> = () =>  {
    const OnboardingContext = OnboardingData();

    const recommendedCategories = ['Bills', 'Entertainment', 'Shopping', 'Food', 'Travel'];

    const handleEnterKey = (e: any) => {
        if (e.key === 'Enter') {
            addCategory();
        }
    }

    const addCategory = (categoryName?: string) => {
        const categories = OnboardingContext.onboardingData?.categories || [];
        const newCategory = categoryName || (document.getElementById('newCategory') as HTMLInputElement).value;
        if (!newCategory) { return }
        if (categories.includes(newCategory)) {
            alert('Category already exists');
            return;
        }
        OnboardingContext.setCategories([...categories, newCategory]);
        if (!categoryName) {
            (document.getElementById('newCategory') as HTMLInputElement).value = '';
        }
    }

    const removeCategory = (category : string) => {
        const categories = OnboardingContext.onboardingData?.categories || [];
        const newCategories = categories.filter((cat: string) => cat !== category);
        OnboardingContext.setCategories(newCategories);
    }
    
    return (
        <>
            <h1 className='section-title roboto-bold'>Spending Categories</h1>
            <p>Please select from the recommended categories or add your own.</p>
            <div className='recommended-categories'>
                {recommendedCategories.map((category, idx) => (
                    <button key={idx} onClick={() => addCategory(category)} className='recommended-category-button'>
                        {category}
                    </button>
                ))}
            </div>
            <div className='form-container hide-scroll' style={{height: 450}}>
                <div className='row' style={{paddingRight: 5, paddingLeft: 5, height: 'fit-content'}}>
                    <input type='text' id='newCategory' placeholder='Category Name' onKeyUp={handleEnterKey}/>
                    <FontAwesomeIcon icon={faSquarePlus} className='add-category-icon' onClick={() => addCategory()}/>
                </div>

                <div className='categories hide-scrollbar'>
                    {OnboardingContext.onboardingData?.categories?.map((category: string, idx: Key | null | undefined) => (
                        <div className='category' key={idx}>
                            <p style={{color: 'black'}}>{category}</p>
                            <FontAwesomeIcon icon={faMinusCircle} className='remove-category-icon' onClick={() => removeCategory(category)}/>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default UserCategories;