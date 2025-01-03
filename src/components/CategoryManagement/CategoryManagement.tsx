import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LinearProgress from '@mui/material/LinearProgress';
import { FC, useState } from 'react';
import { DataApiService } from '../../services/Classes/dataApiService';
import { SetUserCategoryData, UserCategoriesData } from '../../services/Classes/dataContext';
import './CategoryManagement.scss';


interface CategoryManagementProps {}

const CategoryManagement: FC<CategoryManagementProps> = () => {
  const categories = UserCategoriesData() || [];
  const updateCategories = SetUserCategoryData();
  const [loading, setLoading] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>('');

  const handleCategoryChange = (e: any) => {
    setNewCategory(e.target.value);
  }

  const addCategory = async () => {
    setLoading(true);
    const val = newCategory.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase()); // Capitalize first letter and lowercase the rest
    const res = await DataApiService.addCategory(val);
    if (res) {
      updateCategories(categories.concat(val));
    }
    setLoading(false);
    setNewCategory('');
  }
  
  const deleteCategory = async (category: string) => {
    setLoading(true);
    const res = await DataApiService.deleteCategory(category);
    if (res) {
      updateCategories(categories.filter((cat: string) => cat !== category));
    }
    setLoading(false);
  }

  return (
    <>
    {loading ? <LinearProgress color="inherit" /> : null}

    <div className='page'>
      <div className='row'>
        <h3 className='special-title' style={{ marginLeft: '3%', marginTop: '10px', color: 'white'}}>Add Category</h3>
      </div>
      <div className='add-category-row' style={{padding: '10px'}}>
        <input type='text' placeholder='Category' style={{marginLeft: '10px', width: '50%'}} onChange={handleCategoryChange} value={newCategory}/>
        <button className='special-button' style={{marginRight: '10px'}} onClick={addCategory}>Add Category</button>
      </div>

      <div className='row'>
        <h3 className='special-title' style={{ marginLeft: '3%', marginTop: '10px', color: 'white'}}>Categories</h3>
      </div>

      <div className='container-transparent'>
        {categories.length == 0 ? (
            <div className='loading'>Loading...</div>
          ) : (
            categories.map((category: string, index: any) => (
              <div key={index} className='category-row'>

                <div className='item' style={{width: '24%', marginLeft: '20px'}}>
                  <h3 className='roboto-bold'>Category:</h3>
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
