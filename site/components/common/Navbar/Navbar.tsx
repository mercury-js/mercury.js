import cn from 'clsx'
import { FC } from 'react'
import Link from 'next/link'
import s from './Navbar.module.css'
import NavbarRoot from './NavbarRoot'
import { Logo, Container } from '@components/ui'
import { Searchbar, UserNav, NavCategory, HighlightBar } from '@components/common'

interface Link {
  href: string
  label: string
  highlighted?: boolean
}

interface NavbarProps {
  links?: Link[]
}


const links1: Link[] = [
  {href: '/', label: 'Just In'},
  {href: '/', label: 'Best-Sellers'},
  {href: '/', label: 'Selling Out Fat'},
  {href: '/', label: 'Denim Guide'},
  {href: '/', label: 'The Cashmere Collection'},
  {href: '/', label: 'Alpaca Suits'},
  {href: '/', label: 'Sale', highlighted: true},
]

const links2: Link[] = [
  {href: '/', label: 'Denim'},
  {href: '/', label: 'Sweaters'},
  {href: '/', label: 'Pants'},
  {href: '/', label: 'Outerwear'},
  {href: '/', label: 'Shirts & Tops'},
  {href: '/', label: 'Sweatshirts & Sweatpants'},
  {href: '/', label: 'Dresses & Jumpsuits'},
  {href: '/', label: 'Activewear'},
  {href: '/', label: 'Shorts & Skirts'},
  {href: '/', label: 'Underwear'},
]

const links3: Link[] = [
  {href: '/', label: 'Shoes & Boots'},
  {href: '/', label: 'Bags & Backbags'},
  {href: '/', label: 'Socks'},
  {href: '/', label: 'Accessories'},
  {href: '/', label: 'Gift cards', highlighted: true},
]

const subCategories = [
  { type: 'links', subcategoryHeader: 'Features', links: links1},
  { type: 'links', subcategoryHeader: 'Apparel', links: links2},
  { type: 'links', subcategoryHeader: 'Shoes & Accessories', links: links3},
  { type: 'image', img: {src: '/assets/navImg1.avif', alt: 'New Pant Product Image'}, links: [{href: '/', label: 'Shop New Pant'}]},
]



const Navbar: FC<NavbarProps> = ({ links }) => (
  <NavbarRoot>
    <HighlightBar 
      body={<p>Free shipping for the next 48 hours</p>}
    />
    <Container>
      <div className={s.nav}>
        <div className="flex items-center flex-1">
          <Link href="/">
            <a className={s.logo} aria-label="Logo">
              <Logo />
            </a>
          </Link>
          <nav className={s.navMenu}>
            {links?.map((link, i) => (
              <NavCategory key={i} mainLink={link} subcats={subCategories} />
            ))}
          </nav>
        </div>
        {process.env.COMMERCE_SEARCH_ENABLED && (
          <div className="justify-center flex-1 hidden lg:flex">
            <Searchbar />
          </div>
        )}
        <div className="flex items-center justify-end flex-1 space-x-8">
          <UserNav />
        </div>
      </div>
      {process.env.COMMERCE_SEARCH_ENABLED && (
        <div className="flex pb-4 lg:px-6 lg:hidden">
          <Searchbar id="mobile-search" />
        </div>
      )}
    </Container>
  </NavbarRoot>
)

export default Navbar
