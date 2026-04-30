function Container({children})     //accepts property as children and returns a div with some styling and renders the children inside it
{
    return(
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    )
}
export default Container;