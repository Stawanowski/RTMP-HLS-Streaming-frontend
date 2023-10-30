import React, { Component } from 'react'
import styles from './Banner.module.css'
import Image from 'next/image'
import Link from 'next/link'

const Banner = ({src, link}:{src:string, link:string}) => {
  return (
    <Link target='blank' href={`https://${link}`} className={styles.container}>
        <div className={styles.imageContainer}>
        <Image src={ `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/get/${src}`} alt={link} fill className={styles.bannerImage} />
        </div>
    </Link>
  )
}
// class Banner extends Component {
//   render() {
//     const { src, link }:any = this.props;
//     console.log(src);

//     return (
//       <Link target='blank' href={`https://${link}`} className={styles.container}>
//         <div className={styles.imageContainer}>
//           <Image
//             src={`${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/file/get/${src}`}
//             alt={link}
//             fill
//             className={styles.bannerImage}
//           />
//         </div>
//       </Link>
//     );
//   }
// }

export default Banner