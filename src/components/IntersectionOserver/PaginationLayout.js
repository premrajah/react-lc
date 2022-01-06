import React, {Component} from "react";

class PaginationLayout extends Component {

    constructor(props) {
        super(props);
        this.loadingRef = React.createRef();

        this.state = {

            isIntersecting:false,
            intersectionRatio:0,

        }
    }


    componentDidMount() {

        this.loadNewPageSetUp()
    }

    componentWillUnmount() {
        this.observer.unobserve(this.loadingRef);
    }

    // Options
    options = {
        root: null, // Page as root
        rootMargin: '0px',
        threshold: 1.0
    };
    observer
    loadNewPageSetUp=()=>{

        // Create an observer
        this.observer = new IntersectionObserver(
            this.handleObserver.bind(this), //callback
            this.options
        );

        if (this.loadingRef)
            this.observer.observe(this.loadingRef);

    }

    handleObserver=(entities, observer) =>{
        let [entry] = entities


        if (entry.intersectionRatio>this.state.intersectionRatio){
            this.props.loadMore()
        }


        this.setState({
            intersectionRatio:entry.intersectionRatio
        })

    }

    render() {
        const { children } = this.props
        return (

                <>

                    {children}
                        {!this.props.lastPageReached &&    <div className={!this.props.loadingResults?"row  justify-content-center filter-row  pt-3 pb-3":"d-none"}>
                            <div  ref={loadingRef => (this.loadingRef = loadingRef)} className="col">
                                <div>Loading products please wait ...</div>
                            </div>
                        </div>}
                </>


        ) }




}



export default (PaginationLayout);
