import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Test = () => {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Test ShadCN Components</h1>

      <Button variant="default">Click Me</Button>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>This is the content for item 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>This is the content for item 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Test;
