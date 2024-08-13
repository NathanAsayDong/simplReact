import { faMinusCircle, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { OnboardingData } from '../Onboarding.context';
import './UserCategories.scss';



interface UserCategoriesProps {}

const UserCategories: FC<UserCategoriesProps> = () =>  {
    const OnboardingContext = OnboardingData();

    const handleEnterKey = (e: any) => {
        if (e.key === 'Enter') {
            addCategory();
        }
    }

    const addCategory = () => {
        console.log('Add Category');
        const categories = OnboardingContext.onboardingData?.categories;
        const newCategory = document.getElementById('newCategory') as HTMLInputElement;
        if (!newCategory.value) { return }
        if (categories?.includes(newCategory.value)) {
            alert('Category already exists');
            return;
        }
        if (categories) {
            OnboardingContext.setCategories([...categories, newCategory.value]);
        }
        else {
            OnboardingContext.setCategories([newCategory.value]);
        }
        newCategory.value = '';
    }

    const removeCategory = (category : string) => {
        console.log('Remove Category');
        const categories = OnboardingContext.onboardingData?.categories;
        if (categories) {
            const newCategories = categories.filter((cat: any) => cat !== category);
            OnboardingContext.setCategories(newCategories);
        }
    }
    
    return (
        <>
            <h1 className='section-title'>Categories</h1>
            <div className='form-container hide-scroll' style={{height: 368}}>
                <div className='row' style={{paddingRight: 5, paddingLeft: 5}}>
                    <input type='text' id='newCategory' placeholder='Category Name' onKeyUp={handleEnterKey}/>
                    <FontAwesomeIcon icon={faSquarePlus} className='add-category-icon' onClick={addCategory}/>
                </div>

                <div className='categories hide-scrollbar'>
                    {OnboardingContext.onboardingData?.categories?.map((category: string, idx: any) => (
                        <div className='category'>
                            <p id={idx} style={{"color":"black"}}>{category}</p>
                            <FontAwesomeIcon icon={faMinusCircle} className='remove-category-icon' onClick={() => removeCategory(category)}/>
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}

export default UserCategories;