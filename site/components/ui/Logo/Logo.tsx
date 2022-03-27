const Logo = ({ className = '', ...props }) => (
  <img 
    src='/assets/Mercury_store_logo_white.png'
    width={props.width || '40px'}
    height={props.height || '40px'}
  />
)

export default Logo
