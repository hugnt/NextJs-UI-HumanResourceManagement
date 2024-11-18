import Image from "next/image";

export default function loading() {
    return (
        <div>
            <section className="relative place-items-center grid h-64 gap-1 my-auto">
                <div className="bg-blue-500 w-28 h-28  absolute animate-ping rounded-full delay-5s shadow-xl"></div>
                <div className="bg-blue-400 w-20 h-20 absolute animate-ping rounded-full shadow-xl"></div>
                <div className="bg-white w-16 h-16 absolute animate-pulse rounded-full shadow-xl"></div>
                <Image src={'/images/logo1.jpg'} alt='logo' width={25} height={25} quality={100} />
                {/* <svg xmlns="http://www.w3.org/2000/svg" className="text-blue-900 filter mix-blend-overlay h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg> */}
            </section>
            <div className="text-center">
                <span className="text-center text-xl ">Loading ...</span>
            </div>
        </div>

    )
}
