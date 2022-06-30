const Page = ({ page, openModal }) => {

  const openPreview = (state, data, type) => {
    openModal(state, data, type)
  }

  return (
    <div>

      {/* <img src={data.image} alt="image" /> */}

      <p>{ page.details }</p>

      {/* <button onClick={() => openPreview(true, data.image, 'image')}>test</button> */}

    </div>
  )
}

export default Page;