import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { DataApiService } from '../../services/Classes/dataApiService';
import { SetUserCategoryData, UserCategoriesData } from '../../services/Classes/dataContext';
import './Categories.component.scss';


interface CategoryManagementProps {}

const CategoryManagement: FC<CategoryManagementProps> = () => {
  const categories = UserCategoriesData() || [];
  const updateCategories = SetUserCategoryData();
  // const [newCategory, setNewCategory] = useState<string>('');

  // const handleCategoryChange = (e: any) => {
  //   setNewCategory(e.target.value);
  // }

  // const addCategory = async () => {
  //   const val = newCategory.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase()); // Capitalize first letter and lowercase the rest
  //   const res = await DataApiService.addCategory(val);
  //   if (res) {
  //     updateCategories(categories.concat(val));
  //   }
  //   setNewCategory('');
  // }
  
  const deleteCategory = async (category: string) => {
    const res = await DataApiService.deleteCategory(category);
    if (res) {
      updateCategories(categories.filter((cat: string) => cat !== category));
    }
  }

  return (
    <>
      <div className='page hide-scroll'>
        <div className='row' style={{paddingTop: '1em'}}>
            <h3 className='page-title'>Categories</h3>
            <button className='add-button-accounts'><FontAwesomeIcon icon={faPlus} size='lg' /></button>
        </div>

        <div className='container-transparent'>
          {categories.length == 0 ? (
              <div className='loading'>Loading...</div>
            ) : (
              categories.map((category: string, index: any) => (
                <div key={index} className='category-row'>

                  <div className='item' style={{width: '34%', marginLeft: '60px'}}>
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
