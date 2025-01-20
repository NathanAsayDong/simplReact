import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useState } from 'react';
import { DataApiService } from '../../services/Classes/dataApiService';
import { SetUserCategoryData, UserCategoriesData } from '../../services/Classes/dataContext';
import './Categories.component.scss';


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
      <div className='page hide-scroll'>
        <div className='row' style={{paddingTop: '1em'}}>
            <h3 className='page-title'>Categories</h3>
            <button className='add-button-accounts'><FontAwesomeIcon icon={faPlus} size='lg' /></button>
        </div>
        
        <div className='add-category-row'>
          <input type='text' placeholder='Category' style={{marginLeft: '10px', width: '50%'}} onChange={handleCategoryChange} value={newCategory}/>
          <button className='special-button app-button' style={{marginRight: '10px'}} onClick={addCategory}>Add Category</button>
        </div>

        <div className='row'>
          <h3 className='section-title' style={{paddingTop: '1em'}}>Categories</h3>
        </div>

        <div className='container-transparent'>
          {categories.length == 0 ? (
              <div className='loading'>Loading...</div>
            ) : (
              categories.map((category: string, index: any) => (
                <div key={index} className='category-row'>

                  <div className='item' style={{width: '24%', marginLeft: '60px'}}>
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
