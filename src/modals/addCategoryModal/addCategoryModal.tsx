import { FC, useState } from 'react'
import './addCategoryModal.scss'

interface AddCategoryModalProps {
    onClose: () => void;
    onUpload: (categoryName: string) => void;
}

export const AddCategoryModal: FC<AddCategoryModalProps> = ({onClose, onUpload}) => {
    const [categoryName, setCategoryName] = useState<string>('')


    const handleUpload = () => {
        onUpload(categoryName)
    }

    const updateCategoryName = (e: any) => {
        setCategoryName(e.target.value)
    }

    return (
        <>
            <div className='add-category-modal'>
                <input type='text' placeholder='Category Name' value={categoryName} onChange={updateCategoryName} />
                <div className='button-row'>
                    <button onClick={onClose} className='cancel-button'>Cancel</button>
                    <button onClick={handleUpload} className='add-button'>Add</button>
                </div>
            </div>
        </>
    )
}
