import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import './UserCategories.scss';



interface UserCategoriesProps {}

const UserCategories: FC<UserCategoriesProps> = () =>  {
    
    return (
        <>
            <h1>Categories</h1>
            <div className='form-container'>
                <div className='row'>
                    <input type='text' placeholder='Category Name' />
                    <FontAwesomeIcon icon={faSquarePlus} className='add-category-icon' />
                </div>

                <div className='categories'>

                </div>

            </div>
        </>
    )
}

export default UserCategories;