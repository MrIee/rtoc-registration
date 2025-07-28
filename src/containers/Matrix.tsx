import type { FC, JSX } from 'react';
import Accordion from '../components/Accordion';

const Matrix: FC = (): JSX.Element => {
  return (
    <div className="matrix">
      <div className="matrix__section">
        <Accordion buttonClasses="matrix-accordion" title="1. Mapping of Qualifications and Vocational Experience">
          <div className="matrix__body">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, repellat! Incidunt, quae! Eveniet, eos ex! Tempora aut corporis modi quasi! At quod voluptas ipsam! Atque minus porro repellat. Blanditiis, temporibus?</p>
          </div>
        </Accordion>
      </div>
      <div className="matrix__section">
        <Accordion buttonClasses="matrix-accordion" title="2. Professional Development Activities">
          <div className="matrix__body">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, repellat! Incidunt, quae! Eveniet, eos ex! Tempora aut corporis modi quasi! At quod voluptas ipsam! Atque minus porro repellat. Blanditiis, temporibus?</p>
          </div>
        </Accordion>
      </div>
      <div className="matrix__section">
        <Accordion buttonClasses="matrix-accordion" title="3. Work Experience">
          <div className="matrix__body">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, repellat! Incidunt, quae! Eveniet, eos ex! Tempora aut corporis modi quasi! At quod voluptas ipsam! Atque minus porro repellat. Blanditiis, temporibus?</p>
          </div>
        </Accordion>
      </div>
      <div className="matrix__section">
        <Accordion buttonClasses="matrix-accordion" title="4. Professional Subscriptions and Memberships">
          <div className="matrix__body">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, repellat! Incidunt, quae! Eveniet, eos ex! Tempora aut corporis modi quasi! At quod voluptas ipsam! Atque minus porro repellat. Blanditiis, temporibus?</p>
          </div>
        </Accordion>
      </div>
    </div>
  );
};

export default Matrix;
