import './header.scss';
import hamburger from 'images/svg/hamburger.svg';
import profile from 'images/svg/profile.svg';

export default function Header() {
   return (
       <header className="site-header">
           <img src={hamburger} alt="Navigation"/>
           <img src={profile} alt="Profile"/>
       </header>
   );
}