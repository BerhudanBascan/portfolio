import { useTranslation } from 'react-i18next'

export default function ContactButton() {
  const { t } = useTranslation()
  const handleClick = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <button
      onClick={handleClick}
      className="rounded-full font-medium uppercase tracking-widest text-white cursor-pointer px-5 py-2.5 sm:px-8 sm:py-3 md:px-12 md:py-4 text-[0.6rem] sm:text-xs md:text-base"
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
    >
      {t('contact_btn')}
    </button>
  )
}
