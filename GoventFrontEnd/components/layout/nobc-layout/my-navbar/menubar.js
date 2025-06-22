import Link from 'next/link'
import styles from './menubar.module.scss'

// 說明:
// 選單客製化以靜態方式、移至config檔案或寫死(hard code)來產生是常見
// 選單項目定義在這裡，下面元件程式碼會自動產生對應的dom
// id是作key用的，不重覆即可
// 有下拉的選單需要加一個children的陣列屬性
const menuItems = [
  {
    id: 1,
    label: '熱門活動',
    href: '/product',
  },
  {
    id: 2,
    label: '種類',
    href: '/news',
    children: [
      { id: 22, label: '演唱會', href: '/product/list/?category=演唱會' },
      { id: 23, label: '展覽', href: '/product/list/?category=展覽' },
      { id: 24, label: '快閃活動', href: '/product/list/?category=快閃活動' },
      { id: 25, label: '市集', href: '/product/list/?category=市集' },
      {
        id: 26,
        label: '粉絲見面會',
        href: '/product/list/?category=粉絲見面會',
      },
      { id: 27, label: '課程講座', href: '/product/list/?category=課程講座' },
      { id: 28, label: '體育賽事', href: '/product/list/?category=體育賽事' },
      { id: 29, label: '景點門票', href: '/product/list/?category=景點門票' },
    ],
  },
  {
    id: 3,
    label: '地區',
    href: '/member',
    children: [
      {
        id: 32,
        label: '大台北地區',
        href: '/product/list?category=&regionName=基隆市,台北市,新北市',
      },
      {
        id: 33,
        label: '桃園',
        href: '/product/list?category=&regionName=桃園市',
      },
      {
        id: 34,
        label: '新竹地區',
        href: '/product/list?category=&regionName=新竹市,新竹縣',
      },
      {
        id: 35,
        label: '台中',
        href: '/product/list?category=&regionName=台中市',
      },
      {
        id: 36,
        label: '嘉義',
        href: '/product/list?category=&regionName=嘉義縣,嘉義市',
      },
      {
        id: 37,
        label: '台南',
        href: '/product/list?category=&regionName=台南市',
      },
      {
        id: 38,
        label: '高雄',
        href: '/product/list?category=&regionName=高雄市',
      },
      {
        id: 39,
        label: '花蓮',
        href: '/product/list?category=&regionName=花蓮縣',
      },
    ],
  },
]

export default function MainMenu({ currentRoute = '/' }) {
  return (
    <>
      <ul className="navbar-nav flex-grow-1 ps-lg-5 ps-xs-0 mx-auto">
        {menuItems.map((v) => {
          // 用children判斷是否有下拉選單
          if (!v.children) {
            return (
              <li className="nav-item" key={v.id}>
                <Link
                  className={`nav-link ${
                    currentRoute === v.href
                      ? 'active ' + styles['custom-active']
                      : ''
                  }`}
                  aria-current="page"
                  href={v.href}
                >
                  {v.label}
                </Link>
              </li>
            )
          }

          // 以下為有dropmenu(下拉選單)的選單項目的jsx
          return (
            <li
              className={`nav-item dropdown ${styles['dropdown']}`}
              key={v.id}
            >
              <Link
                // 尋找是否有符合 currentRoute 的 children href
                className={`nav-link dropdown-toggle ${
                  v.children.find((v) => v.href === currentRoute)
                    ? 'active ' + styles['custom-active']
                    : ''
                }`}
                href={v.href}
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {v.label}
              </Link>
              <ul
                className={`dropdown-menu bg-bg-gray-light border ${styles['slideIn']} ${styles['dropdown-menu']}`}
              >
                {v.children.map((v2) => {
                  return (
                    <li key={v2.id}>
                      <Link
                        className={`dropdown-item ${
                          currentRoute === v2.href ? 'active' : ''
                        }`}
                        href={v2.href}
                      >
                        {v2.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ul>
    </>
  )
}
