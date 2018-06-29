import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Formfield from "../formfields/formfield";
import Fieldset from "../formfields/fieldset";
import Buttongroup from "../buttongroup/buttongroup";
import Label from "../../atoms/formelements/label/label";
import Button from "../../atoms/button/button";
import Input from "../../atoms/formelements/input/input";

import search from "./search.scss";

const propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    results: PropTypes.shape
};

const Search = props => {
    const { className, children, ...customProps } = props;
    const classProps = classnames(search.search, className);
    return (
        <div className={classProps} {...customProps}>
            <form>
                <Formfield>
                    <Label className="hidden">Field label</Label>
                    <div className="input-with-icon">
                        <Input inputType="search" placeholder="Search" />
                        <svg className="iconic" />
                    </div>
                </Formfield>

                <Buttongroup>
                    <Button buttonType="BETA">Sort</Button>
                    <Button buttonType="BETA">Filter</Button>
                </Buttongroup>
            </form>

            <div className={search["search-card"]}>
                <Fieldset>{children}</Fieldset>

                <Buttongroup>
                    <Button buttonType="BETA">Cancel</Button>
                    <Button buttonType="BETA">Apply</Button>
                </Buttongroup>
            </div>
            <ul />
        </div>
    );
    // {results.length > 0 ? results.map(result => {
    //         //list
    // }) : ""}
    //    </ul>
    //         </div>
};
Search.propTypes = propTypes;

Search.defaultProps = {
    className: "",
    results: []
};

export default Search;
