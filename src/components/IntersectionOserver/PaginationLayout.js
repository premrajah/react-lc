import React, {Component} from "react";

class PaginationLayout extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }


    componentDidMount() {

        this.loadNewPageSetUp()
    }


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
