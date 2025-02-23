import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useState } from 'react';
import { DataApiService } from '../../services/Classes/dataApiService';
import { InitializeDataForContext, SetUserCategoryData, UserCategoriesData } from '../../services/Classes/dataContext';
import './Categories.component.scss';
import { Category } from '../../services/Classes/classes';
import Modal from '@mui/material/Modal';
import { AddCategoryModal } from '../../modals/addCategoryModal/addCategoryModal';
import ConfirmModal from '../../modals/ConfirmModal/ConfirmModal';


interface CategoryManagementProps {}

const CategoryManagement: FC<CategoryManagementProps> = () => {
  const categories: Category[] = UserCategoriesData() || [];
  const updateCategories = SetUserCategoryData();
  const refreshCategories = InitializeDataForContext().refreshCategories;
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

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

  const requestDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowConfirmModal(true);
  }
  
  const deleteCategory = async () => {
    if (!selectedCategory) {
      setShowConfirmModal(false);
      return;
    };
    const res = await DataApiService.deleteCategory(selectedCategory);
    if (res) {
      updateCategories(categories.filter((cat: Category) => cat.categoryId !== selectedCategory.categoryId));
    }
    setShowConfirmModal(false);
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


                  <div className='item' style={{marginRight: '3%', marginLeft: 'auto'}}>
                    <FontAwesomeIcon icon={faTrash} className='trash-icon' onClick={() => requestDeleteCategory(category)}/>
                  </div>
                </div>
              ))
            )}
        </div>
      
      </div>

      <Modal open={showAddCategoryModal}>
        <div>
          <AddCategoryModal onClose={onCloseModal} onUpload={addCategory}/>
        </div>
      </Modal>

      <Modal open={showConfirmModal} onClose={() => {setShowConfirmModal(false)}}>
          <div>
              <ConfirmModal prompt="Are you sure you want to delete this category?"
              onCancel={() => {setShowConfirmModal(false)}}
              onConfirm={() => {deleteCategory()}}/>
          </div>
      </Modal>
    </>
  );
};

export default CategoryManagement;
