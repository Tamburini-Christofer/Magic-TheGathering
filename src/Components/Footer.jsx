const Footer = () => (
  <>
    <div className="contenitoreFooter">
      <div>
        <ul className="linkFooter">
          <li><a>Termini di utilizzo</a></li>
          <li><a>Informativa sulla privacy</a></li>
          <li><a>Servizio clienti</a></li>
        </ul>
      </div>
      <p>
        © 1993-2026 Wizards of the Coast LLC, a subsidiary of Hasbro, Inc. All
        Rights Reserved.
      </p>
            <div>
        <ul className="iconSocial">
          {/* Facebook */}
          <li><a href="https://www.facebook.com/MagicTheGathering.it/?brand_redir=201120755306&locale=it_IT" target="_blank"><i className="fa-brands fa-square-facebook"></i></a></li>
          {/* X (Twitter) */}
          <li><a href="https://x.com/?lang=it" target="_blank"><i className="fa-brands fa-square-x-twitter" ></i></a></li>
          {/* Instagram */}
          <li><a href="https://www.instagram.com/wizards_magic/?__pwa=1" target="_blank"><i className="fa-brands fa-square-instagram"></i></a></li>
          {/* YouTube */}
          <li><a href="https://www.youtube.com/@mtg" target="_blank"><i className="fa-brands fa-youtube"></i></a></li>
          {/* Twitch */}
          <li><a href="https://www.twitch.tv/directory/category/magic-the-gathering" target="_blank"><i className="fa-brands fa-twitch"></i></a></li>
        </ul>
      </div>
    </div>
  </>
);

export default Footer;
