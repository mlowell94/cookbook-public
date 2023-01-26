import menu from '../assets/menu.svg';


const MobileNav = () => {
  const displayMenu = () => {
    const nav = document.querySelector('.navbar')
    const openMenu = document.querySelector('.open-menu')
    if (!openMenu.classList.contains('clicked')) {
        openMenu.classList.add('clicked')
        nav.classList.add('active');
    } else {
        openMenu.classList.remove('clicked')
        nav.classList.remove('active');
    }
  }
  return (
    <div className='mobile-nav'>
        <img src = {menu} alt = 'menu' onClick = {() => displayMenu()} className = "open-menu"/>
    </div>
  )
}

export default MobileNav