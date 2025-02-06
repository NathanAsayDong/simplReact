import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useState } from 'react';
import { DataApiService } from '../../services/Classes/dataApiService';
import { InitializeDataForContext, SetUserCategoryData, UserCategoriesData } from '../../services/Classes/dataContext';
import './Categories.component.scss';
import { Category } from '../../services/Classes/classes';
import Modal from '@mui/material/Modal';
import { AddCategoryModal } from '../../modals/addCategoryModal/addCategoryModal';


interface CategoryManagementProps {}

const CategoryManagement: FC<CategoryManagementProps> = () => {
  const categories: Category[] = UserCategoriesData() || [];
  const updateCategories = SetUserCategoryData();
  const refreshCategories = InitializeDataForContext().refreshCategories;
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);

  const addCategory = async (categoryName: string) => {
    await DataApiService.addCategory(categoryName);
    await refreshCategories();
    setShowAddCategoryModal(false);
  }

  const openModal = () => {
    setShowAddCategoryModal(true);
  }

  const onCloseModal = () => {
    setShowAddCategoryModal(false);
  }
  
  const deleteCategory = async (category: Category) => {
    const res = await DataApiService.deleteCategory(category);
    if (res) {
      updateCategories(categories.filter((cat: Category) => cat.categoryId !== category.categoryId));
    }
  }

  return (
    <>
      <div className='page hide-scroll'>
        <div className='row' style={{paddingTop: '1em'}}>
            <h3 className='page-title'>Categories</h3>
            <button className='add-button-accounts' onClick={openModal} ><FontAwesomeIcon icon={faPlus} size='lg' /></button>
        </div>

        <div className='container-transparent'>
          {categories.length == 0 ? (
              <div className='loading'>Loading...</div>
            ) : (
              categories.map((category: Category, index: any) => (
                <div key={index} className='category-row'>

                  <div className='item' style={{width: '34%', marginLeft: '60px'}}>
                    <h3 className='roboto-bold'>Category:</h3>
                    <h3>{category.categoryName}</h3>
                  </div>


                  <div className='item' style={{marginRight: '5%', marginLeft: 'auto'}}>
                    <FontAwesomeIcon icon={faTrash} className='trash-icon' onClick={() => deleteCategory(category)}/>
                  </div>
                </div>
              ))
            )}
        </div>
      
      </div>

      <Modal
          open={showAddCategoryModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
        <AddCategoryModal onClose={onCloseModal} onUpload={addCategory}/>
      </Modal>
    </>
  );
};

export default CategoryManagement;
