import React, { useState } from 'react'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IWalletCategoryEntry } from '@typedec/Wallet'
import CategorySection from './components/CategorySection'
import ModifyCategoriesModal from '../ModifyCategoriesModal'

function ManageCategoriesModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}): React.ReactElement {
  const [categories, refreshCategories] = useFetch<IWalletCategoryEntry[]>(
    'wallet/category/list'
  )
  const [modifyCategoriesModalOpenType, setModifyCategoriesModalOpenType] =
    useState<'income' | 'expenses' | 'update' | null>(null)
  const [existedData, setExistedData] = useState<IWalletCategoryEntry | null>(
    null
  )
  const [
    deleteCategoriesConfirmationOpen,
    setDeleteCategoriesConfirmationOpen
  ] = useState(false)

  return (
    <>
      <Modal isOpen={isOpen} minWidth="40rem">
        <ModalHeader
          title="Manage Categories"
          icon="tabler:apps"
          onClose={onClose}
        />
        <APIComponentWithFallback data={categories}>
          {typeof categories !== 'string' && categories.length > 0 ? (
            <>
              <CategorySection
                categories={categories}
                type="income"
                iconName="tabler:login-2"
                setModifyCategoriesModalOpenType={
                  setModifyCategoriesModalOpenType
                }
                setExistedData={setExistedData}
                setDeleteCategoriesConfirmationOpen={
                  setDeleteCategoriesConfirmationOpen
                }
              />

              <CategorySection
                categories={categories}
                type="expenses"
                iconName="tabler:logout"
                setModifyCategoriesModalOpenType={
                  setModifyCategoriesModalOpenType
                }
                setExistedData={setExistedData}
                setDeleteCategoriesConfirmationOpen={
                  setDeleteCategoriesConfirmationOpen
                }
              />
            </>
          ) : (
            <EmptyStateScreen
              icon="tabler:apps-off"
              title="Oops, no categories found"
              description="Create a new category to get started"
              ctaContent="Create Category"
              setModifyModalOpenType={() => {
                setModifyCategoriesModalOpenType('income')
              }}
            />
          )}
        </APIComponentWithFallback>
      </Modal>
      <ModifyCategoriesModal
        existedData={existedData}
        setExistedData={setExistedData}
        refreshCategories={refreshCategories}
        openType={modifyCategoriesModalOpenType}
        setOpenType={setModifyCategoriesModalOpenType}
      />
      <DeleteConfirmationModal
        isOpen={deleteCategoriesConfirmationOpen}
        onClose={() => {
          setDeleteCategoriesConfirmationOpen(false)
        }}
        apiEndpoint="wallet/category/delete"
        data={existedData}
        updateDataList={refreshCategories}
        nameKey="name"
        itemName="category"
      />
    </>
  )
}

export default ManageCategoriesModal
