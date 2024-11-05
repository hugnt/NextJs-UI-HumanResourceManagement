import React from 'react'

export default function Calendar() {
    return (
        <section className="relative mt-4 mb-4">
            <div className="w-full max-w-7xl mx-auto">
                <div className="border border-gray-200">
                    <div className="grid grid-cols-7  divide-gray-200 border-b border-gray-200">
                        <div className="p-3.5 flex flex-col sm:flex-row items-center justify-between border-r border-gray-200">
                            <span className="text-sm font-medium text-gray-500">Sun</span>
                            <span className="text-sm font-medium text-gray-900">09</span>
                        </div>
                        <div className="p-3.5 flex flex-col sm:flex-row items-center justify-between border-r border-gray-200">
                            <span className="text-sm font-medium text-gray-500">Mon</span>
                            <span className="text-sm font-medium text-gray-900">10</span>
                        </div>
                        <div className="p-3.5 flex flex-col sm:flex-row items-center justify-between border-r border-gray-200">
                            <span className="text-sm font-medium text-gray-500">Tue</span>
                            <span className="text-sm font-medium text-gray-900">11</span>
                        </div>
                        <div className="p-3.5 flex flex-col sm:flex-row items-center justify-between border-r border-gray-200">
                            <span className="text-sm font-medium text-gray-500">Wed</span>
                            <span className="text-sm font-medium text-gray-900">12</span>
                        </div>
                        <div className="p-3.5 flex flex-col sm:flex-row items-center justify-between border-r border-gray-200">
                            <span className="text-sm font-medium text-gray-500">Thu</span>
                            <span className="text-sm font-medium text-gray-900">13</span>
                        </div>
                        <div className="p-3.5 flex flex-col sm:flex-row items-center justify-between border-r border-gray-200">
                            <span className="text-sm font-medium text-gray-500">Fri</span>
                            <span className="text-sm font-medium text-gray-900">14</span>
                        </div>
                        <div className="p-3.5 flex flex-col sm:flex-row items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Sat</span>
                            <span className="text-sm font-medium text-gray-900">15</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 divide-gray-200">
                        <div className="p-3.5 bg-gray-50   xl:aspect-auto  lg:h-28 border-b border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-500 flex items-center justify-center w-7 h-7 rounded-full ">27</span>
                        </div>
                        <div className="p-3.5 bg-gray-50   xl:aspect-auto  lg:h-28 border-b border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-500 flex items-center justify-center w-7 h-7 rounded-full ">28</span>
                        </div>
                        <div className="p-3.5 bg-gray-50   xl:aspect-auto  lg:h-28 border-b border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-500 flex items-center justify-center w-7 h-7 rounded-full ">29</span>
                        </div>
                        <div className="p-3.5 bg-gray-50   xl:aspect-auto  lg:h-28 border-b border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-500 flex items-center justify-center w-7 h-7 rounded-full ">30</span>
                        </div>
                        <div className="p-3.5 bg-gray-50   xl:aspect-auto  lg:h-28 border-b border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-500 flex items-center justify-center w-7 h-7 rounded-full ">31</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">1</span>
                        </div>
                        <div className="p-3.5  border-b border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">2</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">3</span>
                            <span className="hidden lg:block text-xs font-medium text-gray-500">Meeting with marketing department</span>
                            <span className="lg:hidden w-2 h-2 rounded-full bg-gray-400"></span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">4</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">5</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">6</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">7</span>
                            <span className="hidden lg:block text-xs font-medium text-gray-500">Developer Meetup</span>
                            <span className="lg:hidden w-2 h-2 rounded-full bg-gray-400"></span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">8</span>
                        </div>
                        <div className="p-3.5  border-b  border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">9</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">10</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">11</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-white flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600">12</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">13</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">14</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">15</span>
                        </div>
                        <div className="p-3.5  border-b border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">16</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">17</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">18</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">19</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">20</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">21</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">22</span>
                        </div>
                        <div className="p-3.5  border-b border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">23</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">24</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">25</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">26</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">27</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">28</span>
                        </div>
                        <div className="p-3.5  border-b border-r border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">29</span>
                        </div>
                        <div className="p-3.5  border-b border-gray-200   xl:aspect-auto  lg:h-28 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">30</span>
                        </div>
                        <div className="p-3.5    xl:aspect-auto  lg:h-28 border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-900 flex items-center justify-center w-7 h-7 rounded-full ">31</span>
                        </div>
                        <div className="p-3.5 bg-gray-50   xl:aspect-auto  lg:h-28 border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-500 flex items-center justify-center w-7 h-7 rounded-full ">1</span>
                        </div>
                        <div className="p-3.5 bg-gray-50   xl:aspect-auto  lg:h-28 border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-500 flex items-center justify-center w-7 h-7 rounded-full ">2</span>
                        </div>
                        <div className="p-3.5 bg-gray-50   xl:aspect-auto  lg:h-28 border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-500 flex items-center justify-center w-7 h-7 rounded-full ">3</span>
                        </div>
                        <div className="p-3.5 bg-gray-50   xl:aspect-auto  lg:h-28 border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-500 flex items-center justify-center w-7 h-7 rounded-full ">4</span>
                            <span className="hidden lg:block text-xs font-medium text-gray-500">Meet with friends <br/> 9PM</span>
                            <span className="lg:hidden w-2 h-2 rounded-full bg-gray-400"></span>
                        </div>

                        <div className="p-3.5 bg-gray-50   xl:aspect-auto  lg:h-28 border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-500 flex items-center justify-center w-7 h-7 rounded-full ">5</span>
                        </div>
                        <div className="p-3.5 bg-gray-50   xl:aspect-auto  lg:h-28 border-r border-gray-200 flex justify-between flex-col max-lg:items-center min-h-[70px] transition-all duration-300 hover:bg-gray-100">
                            <span className="text-xs font-semibold text-gray-500 flex items-center justify-center w-7 h-7 rounded-full ">6</span>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:hidden py-8 px-2.5 ">
                    <div className="bg-gray-50 w-full rounded-xl">
                        <div className="p-3 w-full flex items-center justify-between group transition-all duration-300">
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium text-gray-900">Meet with friends</span>
                                <div className="flex items-center gap-2.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 8.99998V13L15 16M3 5.12132L5.10714 3M20.998 5.12657L18.8909 3.00525M20 13C20 17.4183 16.4183 21 12 21C7.58172 21 4 17.4183 4 13C4 8.5817 7.58172 4.99998 12 4.99998C16.4183 4.99998 20 8.5817 20 13Z" stroke="black" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                    <span className="text-xs font-medium text-gray-600">9AM</span>
                                </div>
                            </div>
                            <button className="py-1 px-2 rounded border border-gray-400 text-xs font-medium text-gray-900 opacity-0 transition-all duration-500 group-hover:opacity-100">Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
