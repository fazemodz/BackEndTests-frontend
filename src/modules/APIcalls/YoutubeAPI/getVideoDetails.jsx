import React, { Component } from 'react'
import axios from 'axios'
import Linkify from 'react-linkify'
import '../../css/VideoDetails.css'
//Z3RA7bi5FUM  https://youtu.be/Z3RA7bi5FUM https://youtube.com/Z3RA7bi5FUM 
export default class getVidGetVideoDetailseoDetails extends Component {
    state = {
        YoutubeURL: '',
        DataArray: [],
        SnippetArray: [],
        thumbnailsArray: [],
        ChannelDataArray: [],
        ChannelSnippetArray: [],
        ChannelThumbnailArray: [],
        ChannelStatisticsArray: [],
        RenderChannelData: false
    }
    componentDidMount() {
        let FullURl = window.location.href;
        if(FullURl.includes("http://localhost:5173")){
            let NewYoutubeURL = FullURl.slice(22)
            this.GetAPIData(NewYoutubeURL)
            if(NewYoutubeURL.length === 0){
                this.setState({ RenderChannelData: false })
            }else{
                this.setState({ RenderChannelData: true })
            }
            
        }else{
            let NewYoutubeURL = FullURl.slice(55)
            this.GetAPIData(NewYoutubeURL)
            if(NewYoutubeURL.length === 0){
                this.setState({ RenderChannelData: false })
            }else{
                this.setState({ RenderChannelData: true })
            }
        }
    }
    GetAPIData(NewYoutubeURL) {
        axios.get(`https://youtubevideosearchapi.projectredacted.org/api/v1/youtubeapi/getvideostats/${NewYoutubeURL}`)
            .then((response) => {
                this.setState({ DataArray: response.data.items[0] });
                this.setState({ SnippetArray: response.data.items[0].snippet })
                this.setState({ thumbnailsArray: response.data.items[0].snippet.thumbnails.standard });
                this.GetChannelData();
            })
            .catch((error) => {
                console.log(error)
            })
    }
    GetChannelData() {
        let ChannelID = this.state.SnippetArray.channelId;
        axios.get(`https://youtubevideosearchapi.projectredacted.org/api/v1/youtubeapi/getchannelstats/${ChannelID}`)
            .then((response) => {
                this.setState({ ChannelDataArray: response.data.items[0] });
                this.setState({ ChannelSnippetArray: response.data.items[0].snippet })
                this.setState({ ChannelThumbnailArray: response.data.items[0].snippet.thumbnails.medium })
                this.setState({ ChannelStatisticsArray: response.data.items[0].statistics })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    YoutubrURLCheck() {

        if (this.state.YoutubeURL.includes("https://www.youtube.com/watch?v=")) {
            let NewYoutubeURL = this.state.YoutubeURL.slice(32);
            this.setState({
                YoutubeURL: '',
            })
            this.GetAPIData(NewYoutubeURL)
            this.RenderData()
        } else if (this.state.YoutubeURL.includes("https://youtu.be/")) {
            let NewYoutubeURL = this.state.YoutubeURL.slice(17)
            this.GetAPIData(NewYoutubeURL)
            this.RenderData()

        } else if (!this.state.YoutubeURL.includes("https://www.youtube.com/watch?v=") || !this.state.YoutubeURL.includes("https://youtu.be/")) {
            let NewYoutubeURL = this.state.YoutubeURL
            this.GetAPIData(NewYoutubeURL)
            this.RenderData()
        }
    }
    ChangeHandler = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    onSubmit = e => {
        e.preventDefault();
        this.YoutubrURLCheck();
        this.setState({ RenderChannelData: true })

    }
    RenderData() {

        return (
            <div>
                <title>{this.state.SnippetArray.title}</title>
                <Linkify properties={{ target: '_blank', }}>
                    <div className="Video-Details-Content">
                        <div className="Side-Panel-Content">
                            <div className="Title-Container">
                                <p className="Video-Title">{this.state.SnippetArray.title}</p>
                                <br />
                                <img className="Video-Thumbnail" src={this.state.thumbnailsArray.url} />
                            </div>
                        </div>
                        <div className="Video-Description-Area">
                            <pre className="Video-Description-Text">
                                <p>{this.state.SnippetArray.description}</p>
                            </pre>
                            <div className="Channel-Description">
                                <p>{this.state.ChannelSnippetArray.title}</p>
                                <p>{this.state.ChannelSnippetArray.description}</p>
                                <p>{this.state.ChannelSnippetArray.customUrl}</p>
                                <p>{this.state.ChannelSnippetArray.publishedAt}</p>
                                <img src={this.state.ChannelThumbnailArray.url} />
                                <p>Total View Count: {this.state.ChannelStatisticsArray.viewCount}</p>
                                <p>Total Subs: {this.state.ChannelStatisticsArray.subscriberCount}</p>
                                <p>Total video Count: {this.state.ChannelStatisticsArray.videoCount}</p>
                            </div>
                        </div>

                    </div>


                </Linkify>
            </div>
        )
    }
    render() {
        return (
            <div>

                <div className="InputFormHeader">
                    <div className="HeaderTopBar">
                        <form id="YoutubeURLSearchForm">
                            <input
                                id="URLInput"
                                name="YoutubeURL"
                                placeholder="Add a YouTube URL to search for video details"
                                value={this.state.YoutubeURL}
                                onChange={e => this.ChangeHandler(e)}
                            />
                            <br />
                            <button id="urlSubmitButton" onClick={e => this.onSubmit(e)}>Submit</button>
                        </form>
                    </div>
                </div>
                {this.state.RenderChannelData === false ? (
                    <div></div>
                ) : (
                    this.RenderData()
                )}
            </div>
        )
    }
}