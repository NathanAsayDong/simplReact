import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useEffect, useState } from 'react';
import { TransactionProcessingLocal } from '../../services/Classes/accountProcessingService';
import { SetUserCategoryData, UserCategoriesData } from '../../services/Classes/dataContext';
import NavBar from '../NavBar/NavBar';
import './CategoryManagement.scss';


interface CategoryManagementProps {}

const CategoryManagement: FC<CategoryManagementProps> = () => {
  const categories = UserCategoriesData() || [];
  const updateCategories = SetUserCategoryData();
  const [loading, setLoading] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>('');


  useEffect(() => {
    if (categories.length === 0) {
      setLoading(true);
      initializeCategories();
    }
  });

  const initializeCategories = async () => {
    const res = await TransactionProcessingLocal.getAllCategories();
    if (res) {
      updateCategories(res);
    } else {
      console.log('Failed to get categories');
    }
    setLoading(false);
  };

  const handleCategoryChange = (e: any) => {
    setNewCategory(e.target.value);
  }

  const addCategory = async () => {
    setLoading(true);
    const val = newCategory.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase()); // Capitalize first letter and lowercase the rest
    const res = await TransactionProcessingLocal.addCategory(val);
    if (res) {
      console.log(res);
      initializeCategories();
    } else {
      console.log('Failed to add category');
    }
    setLoading(false);
    setNewCategory('');
  }
  
  const deleteCategory = async (category: string) => {
    setLoading(true);
    const res = await TransactionProcessingLocal.deleteCategory(category);
    if (res) {
      console.log(res);
      initializeCategories();
    } else {
      console.log('Failed to delete category');
    }
    setLoading(false);
  }


  const test = async () => {
    console.log('test');
    await TransactionProcessingLocal.getAllCategories();
  }



  return (
    <>
    <NavBar />
    <div className='body'>

      <div className='container'>
        <div className='row'>
          <div className='item' style={{width: '75%'}}>
            <h2 className='section-header'>Add Category</h2>
            <input type='text' placeholder='Category' onChange={handleCategoryChange} value={newCategory}/>
          </div>
          <button className='special-button' onClick={addCategory}>Add Category</button>
        </div>
      </div>

      <div className='container'>
        <div className='row'>
          <h2 className='section-header'>Categories</h2>
        </div>
        {loading ? (
            <div className='loading'>Loading...</div>
          ) : (
            categories.map((category: string, index: any) => (
              <div key={index} className='account-row'>

                <div className='item' style={{width: '24%'}}>
                  <h3>Category:</h3>
                  <h3>{category}</h3>
                </div>


                <div className='item' style={{marginRight: '5%', marginLeft: 'auto'}}>
                  <FontAwesomeIcon icon={faTrash} className='trash-icon' onClick={() => deleteCategory(category)}/>
                </div>
              </div>
            ))
          )}
      </div>
      
    </div>
    </>
  );
};

export default CategoryManagement;
