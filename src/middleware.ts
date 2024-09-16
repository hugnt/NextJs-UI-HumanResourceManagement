import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
// This function can be marked `async` if using `await` inside
const privatePaths = ["/sample-list"];
const authPaths =  ['/login','/register'];

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl
    const sessionToken = request.cookies.get('sessionToken')?.value;

    //Check private path
    // if(privatePaths.some(path=>pathname.startsWith(path))&&!sessionToken){
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }

    //Đăng nhập rồi thì ko cho vào login nữa
    // if(privatePaths.some(path=>pathname.startsWith(path))&&sessionToken){
    //   return NextResponse.redirect(new URL("/", request.url));
    // }
    return NextResponse.next();
  
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/login','/register',"/sample-list"],
};
